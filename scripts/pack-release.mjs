#!/usr/bin/env node

// Packs every publishable workspace package into a tarball that can be
// attached to a GitHub release, so other projects can depend on it by URL:
//
//   "@oneadvisory/protobuf-ts-plugin": "https://github.com/oneadvisory/protobuf-ts/releases/download/7.1.0/oneadvisory-protobuf-ts-plugin-7.1.0.tgz"
//
// Dependencies between workspace packages are rewritten to point at the
// matching release tarballs. Otherwise, installing the plugin tarball would
// make npm resolve @oneadvisory/protobuf-ts-runtime etc. from the GitHub
// package registry, which needs a PAT.
//
// USAGE: node scripts/pack-release.mjs [out-dir]   (default: dist)
//
// Run after building. package.json files are restored after packing.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const outDir = resolve(process.argv[2] ?? "dist");
const root = JSON.parse(readFileSync("package.json", "utf-8"));
const repoUrl = "https://github.com/oneadvisory/protobuf-ts";

const workspaces = root.workspaces
    .map((ws) => join(ws, "package.json"))
    .filter((path) => existsSync(path))
    .map((path) => {
        const raw = readFileSync(path, "utf-8");
        return { path, dir: dirname(path), raw, pkg: JSON.parse(raw) };
    })
    .filter((ws) => ws.pkg.private !== true && ws.pkg.version !== undefined);

const versions = new Set(workspaces.map((ws) => ws.pkg.version));
if (versions.size !== 1) {
    fail(`Workspace packages have differing versions: ${[...versions].join(", ")}`);
}
const version = [...versions][0];
const tag = version;
if (process.env.GITHUB_REF_TYPE === "tag" && process.env.GITHUB_REF_NAME !== tag) {
    fail(`Tag ${process.env.GITHUB_REF_NAME} does not match package version ${version}`);
}

// npm pack names a scoped package "@scope/name" as "scope-name-<version>.tgz"
const tarballName = (name) => `${name.replace(/^@/, "").replace("/", "-")}-${version}.tgz`;
const tarballUrl = (name) => `${repoUrl}/releases/download/${tag}/${tarballName(name)}`;
const localNames = new Set(workspaces.map((ws) => ws.pkg.name));

mkdirSync(outDir, { recursive: true });

for (const ws of workspaces) {
    const pkg = structuredClone(ws.pkg);
    for (const key of ["dependencies", "peerDependencies", "optionalDependencies"]) {
        for (const dep of Object.keys(pkg[key] ?? {})) {
            if (localNames.has(dep)) {
                pkg[key][dep] = tarballUrl(dep);
            }
        }
    }
    try {
        writeFileSync(ws.path, JSON.stringify(pkg, null, 2) + "\n");
        execFileSync("npm", ["pack", "--pack-destination", outDir], {
            cwd: ws.dir,
            stdio: ["ignore", "ignore", "inherit"],
        });
    } finally {
        writeFileSync(ws.path, ws.raw);
    }
    const file = join(outDir, tarballName(pkg.name));
    if (!existsSync(file)) {
        fail(`Expected ${file} after packing ${pkg.name}`);
    }
    process.stdout.write(`${file}\n`);
}

function fail(msg) {
    process.stderr.write(msg + "\n");
    process.exit(1);
}
