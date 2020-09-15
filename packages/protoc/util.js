const path = require("path");
const fs = require("fs");
const assert = require("assert");

const standardInstallDirectory = path.join(__dirname, "installed");
module.exports.standardInstallDirectory = standardInstallDirectory;


/**
 * @typedef {Object} DistEntry
 * @property {string} name
 * @property {string} version
 * @property {string} protocPath
 * @property {string} includePath
 */

/**
 * @param {string} installDir
 * @return {DistEntry[]}
 */
module.exports.listInstalled = function listInstalled(installDir = standardInstallDirectory) {
    let entries = [];
    for (let name of fs.readdirSync(installDir)) {
        let abs = path.join(installDir, name);
        if (!fs.lstatSync(abs).isDirectory()) {
            continue;
        }
        // looking for directory names "protoc-3.13.0-win32"
        if (!name.startsWith("protoc-")) {
            continue;
        }
        let version = name.split("-")[1];
        let protocPath = path.join(abs, "bin/protoc.exe");
        if (!fs.existsSync(protocPath)) {
            protocPath = path.join(abs, "bin/protoc");
        }
        let includePath = path.join(abs, "include/")
        entries.push({name, version, protocPath, includePath});
    }
    return entries;
};


/**
 * Download url into path. Returns path.
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
module.exports.httpDownload = function download(url) {
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
};

/**
 * @param {string} url
 * @return {Promise<string>}
 */
module.exports.httpGetRedirect = function getRedirect(url) {
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
};


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
 * protoc-3.13.0-linux-aarch_64.zip
 * protoc-3.13.0-linux-ppcle_64.zip
 * protoc-3.13.0-linux-s390x.zip
 * protoc-3.13.0-linux-x86_32.zip
 * protoc-3.13.0-linux-x86_64.zip
 * protoc-3.13.0-osx-x86_64.zip
 * protoc-3.13.0-win32.zip
 * protoc-3.13.0-win64.zip
 *
 * @param {ReleaseParameters} params
 * @return {string}
 */
module.exports.makeReleaseName = function makeReleaseName(params) {
    let build = `${params.platform}-${params.arch}`;
    switch (params.platform) {
        case "darwin":
            if (params.arch === "x64") {
                build = 'osx-x86_64'
            }
            break;
        case "linux":
            if (params.arch === "x64") {
                build = 'linux-x86_64'
            } else if (params.arch === "x32") {
                build = 'linux-x86_32'
            }
            break;
        case "win32":
            if (params.arch === "x64") {
                build = 'win64'
            } else if (params.arch === "x64") {
                build = 'win32'
            }
            break;
    }
    return `protoc-${params.version}-${build}`;
}


/**
 * Reads the package json from the given path if it exists and
 * looks for config.protocVersion.
 *
 * If the package json did *not* specify a version, search for
 * a global config value using process.env.
 *
 * If nothing was found, return undefined.
 *
 * @param {string} pkgPath
 * @returns {string | undefined}
 */
module.exports.findProtocVersionConfig = function findProtocVersionConfig(pkgPath) {
    let version = undefined;
    if (fs.existsSync(pkgPath)) {
        let json = fs.readFileSync(pkgPath, {encoding: "UTF-8"});
        let pkg = JSON.parse(json);
        let isLinkedOrOtherInternal = typeof pkg.name == "string" && pkg.name.startsWith("@protobuf-ts/");
        if (!isLinkedOrOtherInternal) {
            if (typeof pkg.config === "object" && pkg.config !== null) {
                if (pkg.config.hasOwnProperty("protocVersion") && typeof pkg.config.protocVersion == "string") {
                    version = pkg.config.protocVersion;
                }
            }
        }
    }
    let configValue = process.env.npm_package_config_protocVersion;
    if (!version && typeof configValue == "string") {
        version = configValue;
    }
    return version;
};


/**
 * @param {string} cwd
 * @returns {string|undefined}
 */
module.exports.findProtobufTs = function (cwd) {
    let plugin = path.join(cwd, "node_modules", "@protobuf-ts", "plugin");
    return fs.existsSync(plugin) ? plugin : undefined;
}


/**
 * @param {string} cwd
 * @returns {string[]}
 */
module.exports.findProtocPlugins = function (cwd) {
    let plugins = [];
    let binDir = path.join(cwd, "node_modules", ".bin");
    if (!fs.existsSync(binDir)) {
        return plugins;
    }
    if (!fs.lstatSync(binDir).isDirectory()) {
        return plugins;
    }
    for (let name of fs.readdirSync(binDir)) {
        if (!name.startsWith("protoc-gen-")) {
            continue;
        }
        let plugin = path.join("node_modules", ".bin", name);
        plugins.push(plugin);
    }
    return plugins;
};


/**
 * @callback fileCallback
 * @param {Buffer} data
 * @param {LocalHeader} header
 */
/**
 * @param {Buffer} buffer
 * @param {fileCallback} onFile
 */
module.exports.unzip = function unzip(buffer, onFile) {
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
