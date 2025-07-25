#!/usr/bin/env node

const {cpSync} = require('node:fs');
const {join} = require('node:path');
const {ensureInstalled, readVersion} = require('./util');

main().catch(err => {
    console.error((err instanceof Error) ? err.message : err);
    process.exit(1);
});

async function main() {
    const {includePath} = await ensureInstalled(readVersion());
    const targetPath = join(process.cwd(), "proto");
    cpSync(includePath, targetPath, {
        preserveTimestamps: true,
        recursive: true,
    });
}

