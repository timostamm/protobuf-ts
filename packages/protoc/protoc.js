#!/usr/bin/env node


// Automatically installs protoc, then runs it transiently.
//
// Downloads a protoc release for the current platform:
// - checks for a 'config.protocVersion' setting - or defaults to 'latest'
// - downloads the release archive and unzips it into this package
//
// Wraps calls to protoc and adds the following special behaviour:
// 1. add a `--proto_path` argument that points to the `include/` directory of the
//    downloaded release
// 2. add a `--plugin` argument for all plugins found in `node_modules/.bin/`
// 3. add a `--proto_path` argument for `node_modules/@protobuf-ts/plugin`

const {spawnSync} = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const {findProtocVersionConfig, listInstalled, findProtocPlugins, findProtobufTs, unzip, makeReleaseName, httpGetRedirect, httpDownload, mkDirRecursive, standardInstallDirectory} = require('./util');


// search for a configured specific protoc version
let version = findProtocVersionConfig(process.cwd());


ensureInstalled(version).then(release => {
    let command = release.protocPath;
    let args = [
        // pass all arguments to the process
        ...process.argv.slice(2),
        // add the "include" directory of the installed protoc to the proto path
        // do this last, otherwise it can shadow a user input
        "--proto_path", release.includePath,
    ];

    // search for @protobuf-ts/plugin in node_modules and add --proto_path argument
    let protobufTs = findProtobufTs(process.cwd());
    if (protobufTs) {
        args.push("--proto_path", protobufTs);
    }

    // search for any protoc-gen-xxx plugins in .bin and add --plugin arguments for them
    for (let plugin of findProtocPlugins(process.cwd())) {
        args.unshift("--plugin", plugin);
    }

    let child = spawnSync(command, args, {
        // protoc accepts stdin for some commands, pipe all IO
        stdio: [process.stdin, process.stdout, process.stderr],
        shell: false
    });

    if (child.error) {
        throw new Error("@protobuf-ts/protoc was unable to spawn protoc. " + child.error);
    }
    process.exit(child.status);

}).catch(err => {
    console.error((err instanceof Error) ? err.message : err);
    process.exit(1);
});



async function ensureInstalled(version) {
    // resolve the latest release version number if necessary
    if (version === "latest" || version === undefined) {
        let latestLocation;
        try {
            latestLocation = await httpGetRedirect("https://github.com/protocolbuffers/protobuf/releases/latest");
        } catch (e) {
            throw new Error(`@protobuf-ts/protoc failed to retreive lastest protoc version number: ${e}`);
        }
        version = latestLocation.split("/v").pop();
    }

    // make the release name for the current platform and the requested version number
    let releaseName = makeReleaseName({
        platform: os.platform(),
        arch: os.arch(),
        version: version
    });

    let alreadyInstalled = listInstalled().find(i => i.name === releaseName);
    if (alreadyInstalled) {
        return alreadyInstalled;
    }

    // download the release
    let archive;
    try {
        archive = await httpDownload(`https://github.com/protocolbuffers/protobuf/releases/download/v${version}/${releaseName}.zip`);
    } catch (e) {
        throw new Error(`@protobuf-ts/protoc failed to download protoc v${version}. \nDid you misspell the version number? The version number must look like "3.0.12", without a leading "v".\n${e}`);
    }
    let archivePath = path.join(standardInstallDirectory, releaseName);
    unzip(archive, (data, header) => {
        let filename = path.join(archivePath, header.filename);
        mkDirRecursive(path.dirname(filename));
        fs.writeFileSync(filename, data, {
            mode: header.filename.includes("bin/") ? 0o755 : 0o666
        });
    });

    let installed = listInstalled().find(i => i.name === releaseName);
    if (!installed) {
        throw new Error(`@protobuf-ts/protoc failed to install protoc v${version}.`);
    }

    console.info(`@protobuf-ts/protoc installed protoc v${installed.version}.`);

    return installed;
}

