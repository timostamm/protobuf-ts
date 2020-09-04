#!/usr/bin/env node
//
// Lifecycle script "version"
// ==========================
//
// See https://github.com/lerna/lerna/tree/master/commands/version#lifecycle-scripts
//
// Lerna updates `package.json` on `lerna version` and `lerna publish`.
// But we need `dist/package.json` to be updated.
// Also, "peerDependencies" of `package.json` do not pick up version bumps,
// we update them ourselves.


let fs = require("fs");


// update package.json:
// - replace the version number of all "peerDependencies"
//   that are part of protobuf-ts with the version number
//   of package.json
let pkgPath = "./package.json";
let pkg = read(pkgPath);
updatePeerDeps(pkg, pkg.version);
write(pkg, pkgPath);


// update of dist package.json:
// - set version number to version number of package.json.
// - replace the version number of all "peerDependencies"
//   that are part of protobuf-ts with the version number
//   of package.json
let distPkgPath = "./dist/package.json";
let distPkg = read(distPkgPath);
distPkg.version = pkg.version;
updatePeerDeps(distPkg, pkg.version);
write(distPkg, distPkgPath);


function updatePeerDeps(pkg, version) {
  if (!pkg.peerDependencies) {
    return;
  }
  for (let key of Object.keys(pkg.peerDependencies)) {
    if (!key.startsWith("@protobuf-ts/")) {
      continue;
    }
    pkg.peerDependencies[key] = version;
  }
}

function write(pkg, path) {
  let json = JSON.stringify(pkg, undefined, 2);
  fs.writeFileSync(path, json);
}

function read(path) {
  let json = fs.readFileSync(path, {encoding: "utf8"});
  return JSON.parse(json);
}
