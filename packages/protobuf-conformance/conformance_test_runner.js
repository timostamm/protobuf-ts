#!/usr/bin/env node

const {spawnSync} = require('child_process');
const {ensureInstalled, findVersionConfig} = require('./util');

main().catch(err => {
    console.error((err instanceof Error) ? err.message : err);
    process.exit(1);
});

async function main() {
    const configuredVersion = findVersionConfig(process.cwd());
    const { conformanceTestRunnerPath } = await ensureInstalled(configuredVersion);
    const child = spawnSync(conformanceTestRunnerPath, process.argv.slice(2), {
        stdio: "inherit",
        shell: false
    });
    if (child.error) {
        throw new Error("@protobuf-ts/protobuf-conformance was unable to spawn conformance_test_runner. " + child.error);
    }
    process.exit(child.status);
}
