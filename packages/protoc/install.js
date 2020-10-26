#!/usr/bin/env node

// downloads a protoc release for the current platform:
// - checks for a 'config.protocVersion' setting - or defaults to 'latest'
// - build a release archive name from the version number and platform
// - downloads the archive and unzips (into a directory of this package)
//
// to be run after this package is installed.


const os = require("os");
const path = require("path");
const fs = require("fs");
const {httpDownload, httpGetRedirect, makeReleaseName, findProtocVersionConfig, listInstalled, standardInstallDirectory, unzip, mkDirRecursive} = require("./util");


main().then(release => {
    console.info(`protobuf-ts installed protoc v${release.version}. Just use \`npx protoc\` to run.`);
}, e => {
    console.warn("Sorry, protobuf-ts was unable to install protoc...");
    if (typeof e == "string") {
        console.warn(e);
    }
    if (typeof e == "object" && e !== null && e.hasOwnProperty("message") && typeof e.message == "string") {
        console.warn(e.message);
    }
    process.exit(0);
});


async function main() {

    // search for a configured specific protoc version
    let version = findProtocVersionConfig(
        // this should be the path to the users package.json
        path.join(process.cwd(), "..", "..", "..", "package.json")
    );

    // resolve the latest release version number if necessary
    if (version === "latest" || version === undefined) {
        let latestLocation = await httpGetRedirect("https://github.com/protocolbuffers/protobuf/releases/latest");
        version = latestLocation.split("/v").pop();
    }

    // make the release name for the current platform and the requested version number
    let releaseName = makeReleaseName({
        platform: os.platform(),
        arch: os.arch(),
        version: version
    });

    // if this release is already installed for some reason, exit
    let alreadyInstalled = listInstalled().find(i => i.version === version);
    if (alreadyInstalled) {
        return alreadyInstalled;
    }

    // download the release
    let archive = await httpDownload(`https://github.com/protocolbuffers/protobuf/releases/download/v${version}/${releaseName}.zip`);
    let archivePath = path.join(standardInstallDirectory, releaseName);
    unzip(archive, (data, header) => {
        let filename = path.join(archivePath, header.filename);
        fs.mkDirRecursive(path.dirname(filename));
        fs.writeFileSync(filename, data, {
            mode: header.filename.includes("bin/") ? 0o755 : 0o666
        });
    });

    // verify
    let installed = listInstalled();
    if (installed.length < 1) {
        throw new Error();
    }
    return installed[0];
}
