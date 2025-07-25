const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const assert = require("node:assert");

const standardInstallDirectory = path.join(__dirname, "installed");

module.exports.standardInstallDirectory = standardInstallDirectory;
module.exports.makeReleaseName = makeReleaseName;
module.exports.readVersion = readVersion;


module.exports.ensureInstalled = async function ensureInstalled(version) {
    const releaseUrl = process.env.PROTOBUF_CONFORMANCE_RELEASES_URL || "https://github.com/bufbuild/protobuf-conformance/releases";
    // resolve the latest release version number if necessary
    if (version === "latest" || version === undefined) {
        let latestLocation;
        try {
            latestLocation = await httpGetRedirect(`${releaseUrl}/latest`);
        } catch (e) {
            throw new Error(`@protobuf-ts/protobuf-conformance failed to retrieve latest version number: ${e}`);
        }
        version = latestLocation.split("/v").pop();
    }

    // make the release name for the current platform and the requested version number
    const releaseName = makeReleaseName({
        platform: os.platform(),
        arch: os.arch(),
        version: version
    });

    // if this release is already installed, we are done here
    const alreadyInstalled = listInstalled().find(i => i.name === releaseName);
    if (alreadyInstalled) {
        return alreadyInstalled;
    }

    // download the release
    let archive;
    try {
        archive = await httpDownload(`${releaseUrl}/download/v${version}/${releaseName}.zip`);
    } catch (e) {
        throw new Error(`@protobuf-ts/protobuf-conformance failed to download v${version}\n${e}`);
    }

    // unzip the archive
    let archivePath = path.join(standardInstallDirectory, releaseName);
    try {
        unzip(archive, (data, header) => {
            let filename = path.join(archivePath, header.filename);
            mkDirRecursive(path.dirname(filename));
            fs.writeFileSync(filename, data, {
                mode: header.filename.includes("bin/") ? 0o755 : 0o666
            });
        });
    } catch (e) {
        throw new Error(`@protobuf-ts/protobuf-conformance failed unzip the downloaded release v${version}: ${e}`);
    }

    // sanity check
    let installed = listInstalled().find(i => i.name === releaseName);
    if (!installed) {
        throw new Error(`@protobuf-ts/protobuf-conformance failed to install v${version}.`);
    }

    // finished
    console.info(`@protobuf-ts/protobuf-conformance installed v${installed.version}.`);
    return installed;
}


/**
 * Make directory, creating missing parent directories as well.
 * Equivalent to fs.mkdirSync(p, {recursive: true});
 * @param {string} dirname
 */
function mkDirRecursive(dirname) {
    if (!path.isAbsolute(dirname)) {
        dirname = path.join(process.cwd(), dirname);
    }
    dirname = path.normalize(dirname);
    let parts = dirname.split(path.sep);
    for (let i = 2; i <= parts.length; i++) {
        let p = parts.slice(0, i).join(path.sep);
        if (fs.existsSync(p)) {
            let i = fs.lstatSync(p);
            if (!i.isDirectory()) {
                throw new Error("cannot mkdir '" + dirname + "'. '" + p + "' is not a directory.");
            }
        } else {
            fs.mkdirSync(p);
        }
    }
}


/**
 * @typedef {Object} DistEntry
 * @property {string} name
 * @property {string} version
 * @property {string} conformanceTestRunnerPath
 * @property {string} includePath
 */

/**
 * @param {string} installDir
 * @return {DistEntry[]}
 */
function listInstalled(installDir = standardInstallDirectory) {
    const entries = [];
    for (const name of fs.readdirSync(installDir)) {
        const abs = path.join(installDir, name);
        if (!fs.lstatSync(abs).isDirectory()) {
            continue;
        }
        // looking for directory names "protoc-3.13.0-win32"
        if (!name.startsWith("conformance_test_runner-")) {
            continue;
        }
        const version = name.split("-")[1];
        let conformanceTestRunnerPath = path.join(abs, "bin/conformance_test_runner.exe");

        if (!fs.existsSync(conformanceTestRunnerPath)) {
            conformanceTestRunnerPath = path.join(abs, "bin/conformance_test_runner");
        }
        const includePath = path.join(abs, "include/")
        entries.push({name, version, conformanceTestRunnerPath, includePath});
    }
    return entries;
};


/**
 * Download url into path. Returns path.
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
function httpDownload(url) {
    assert(typeof url === "string" && url.length > 0);
    assert(url.startsWith("https://") || url.startsWith("http://"));
    const chunks = [];
    return new Promise((resolve, reject) => {
        httpGet(url, []).then(
            response => {
                response.setEncoding("binary");
                response.on("data", chunk => {
                    chunks.push(Buffer.from(chunk, "binary"))
                });
                response.on("end", () => {
                    resolve(Buffer.concat(chunks));
                })
            },
            reason => reject(reason)
        );
    });
}

/**
 * @param {string} url
 * @return {Promise<string>}
 */
function httpGetRedirect(url) {
    assert(typeof url === "string" && url.length > 0);
    assert(url.startsWith("https://") || url.startsWith("http://"));
    const client = url.startsWith("https") ? require("https") : require("http");
    return new Promise((resolve, reject) => {
        const request = client.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400) {
                let location = response.headers.location;
                assert(location && location.length > 0);
                resolve(location);
            } else if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode} for ${url}`));
            } else {
                reject(new Error(`Did not get expected redirect for ${url}`));
            }
        });
        request.on("error", reject);
    });
}


/**
 * HTTP GET, follows up to 3 redirects
 * @param {string} url
 * @param {string[]} redirects
 * @returns {Promise<IncomingMessage>}
 */
function httpGet(url, redirects) {
    assert(typeof url === "string" && url.length > 0);
    assert(url.startsWith("https://") || url.startsWith("http://"));
    assert(Array.isArray(redirects));
    assert(redirects.length <= 3);
    const client = url.startsWith("https") ? require("https") : require("http");
    return new Promise((resolve, reject) => {
        const request = client.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400) {
                let location = response.headers.location;
                assert(location && location.length > 0);
                let follow = httpGet(location, redirects.concat(location));
                resolve(follow);
            } else if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode} for ${url}`));
            } else {
                resolve(response);
            }
        });
        request.on("error", reject);
    });
}


/**
 * @typedef {Object} ReleaseParameters
 * @property {NodeJS.Platform} platform
 * @property {CPUArchitecture} arch
 * @property {string} version - without leading "v"
 */

/**
 * @typedef {("arm" | "arm64" | "ia32" | "mips" | "mipsel" | "ppc" | "ppc64" | "s390" | "s390x" | "x32" | "x64")} CPUArchitecture
 */

/**
 * @param {ReleaseParameters} params
 * @return {string}
 */
function makeReleaseName(params) {
    let build = `${params.platform}-${params.arch}`;
    switch (params.platform) {
        case "darwin":
            if (params.arch === "arm64") {
                // build = 'osx-aarch_64'
                build = 'osx-x86_64'
            } else if (params.arch === "x64") {
                build = 'osx-x86_64'
            } else {
                build = 'osx-universal_binary'
            }
            break;
        case "linux":
            if (params.arch === "x64") {
                build = 'linux-x86_64'
            } else if (params.arch === "x32") {
                build = 'linux-x86_32'
            } else if (params.arch === "arm64") {
                build = 'linux-aarch_64'
            }
            break;
        case "win32":
            if (params.arch === "x64") {
                build = 'win64'
            } else if (params.arch === "x32" || params.arch === "ia32") {
                build = 'win32'
            }
            break;
    }
    return `conformance_test_runner-${params.version}-${build}`;
}


/**
 * Reads version.txt.
 *
 * @returns {string}
 */
function readVersion() {
    return fs.readFileSync(path.join(__dirname, "version.txt"), "utf8");
}

/**
 * @callback fileCallback
 * @param {Buffer} data
 * @param {LocalHeader} header
 */
/**
 * @param {Buffer} buffer
 * @param {fileCallback} onFile
 */
function unzip(buffer, onFile) {
    const
        zlib = require("zlib"),
        localHeaderSig = 0x04034b50, // Local file header signature
        centralHeaderSig = 0x02014b50, // Central directory file header signature
        eocdRecordSig = 0x06054b50, // End of central directory record (EOCD)
        optDataDescSig = 0x08074b50, // Optional data descriptor signature
        methodStored = 0,
        methodDeflated = 8;
    let pos = 0;
    let cenFound = false;
    while (pos < buffer.byteLength && !cenFound) {
        if (buffer.byteLength - pos < 2) {
            throw new Error("Signature too short at " + pos);
        }
        let sig = buffer.readUInt32LE(pos);
        switch (sig) {

            case localHeaderSig:
                let header = readLocalHeader();
                let compressedData = buffer.subarray(pos, pos + header.compressedSize);
                let uncompressedData;
                switch (header.compressionMethod) {
                    case methodDeflated:
                        uncompressedData = zlib.inflateRawSync(compressedData);
                        break;
                    case methodStored:
                        uncompressedData = compressedData;
                        break;
                    default:
                        throw new Error("Unsupported compression method " + header.compressionMethod);
                }
                if (header.filename[header.filename.length - 1] !== "/") {
                    onFile(uncompressedData, header);
                }
                pos += header.compressedSize;
                break;

            case centralHeaderSig:
                cenFound = true;
                break;

            default:
                throw new Error("Unexpected signature " + sig);
        }
    }


    /**
     * @typedef {Object} LocalHeader
     * @property {number} version
     * @property {number} generalPurposeFlags
     * @property {number} compressionMethod
     * @property {number} lastModificationTime
     * @property {number} lastModificationDate
     * @property {number} crc32
     * @property {number} compressedSize
     * @property {number} uncompressedSize
     * @property {string} filename
     * @property {Buffer} extraField
     *
     * @returns {undefined|LocalHeader}
     */
    function readLocalHeader() {
        let sig = buffer.readUInt32LE(pos);
        if (sig !== localHeaderSig) {
            throw new Error("Unexpected local header signature " + sig.toString(16) + " at " + pos);
        }
        if (buffer.byteLength - pos < 30) {
            throw new Error("Local header too short at " + pos);
        }
        let version = buffer.readUInt32LE(pos + 4);
        let generalPurposeFlags = buffer.readUInt16LE(pos + 6);
        let compressionMethod = buffer.readUInt16LE(pos + 8);
        let lastModificationTime = buffer.readUInt16LE(pos + 10);
        let lastModificationDate = buffer.readUInt16LE(pos + 12);
        let crc32 = buffer.readUInt32LE(pos + 14);
        let compressedSize = buffer.readUInt32LE(pos + 18);
        let uncompressedSize = buffer.readUInt32LE(pos + 22);
        let filenameLength = buffer.readUInt16LE(pos + 26);
        let extraFieldLength = buffer.readUInt16LE(pos + 28);
        let filename = buffer.subarray(pos + 30, pos + 30 + filenameLength).toString();
        let extraField = buffer.subarray(pos + 30 + filenameLength, pos + 30 + filenameLength + extraFieldLength);
        pos += 30 + filenameLength + extraFieldLength;
        return {
            version,
            generalPurposeFlags,
            compressionMethod,
            lastModificationTime,
            lastModificationDate,
            crc32,
            compressedSize,
            uncompressedSize,
            filename,
            extraField
        };
    }

}
