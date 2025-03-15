#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

// Copy default spec files to current dir

const sourceDir = path.join(__dirname, "..", "spec");
const specs = new Map(
    fs.readdirSync(sourceDir, {withFileTypes: true})
        .filter(e => e.isFile())
        .map(e => e.name)
        .filter(f => f.endsWith(".ts"))
        .map(f => [f, fs.readFileSync(path.join(sourceDir, f), "utf-8")])
        .map(([name, content]) => [name, insertNote(content, name)])
);

function insertNote(txt, name) {
    const lines = txt.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === "") {
            lines.splice(i + 1, 0, `// Copied from test-default/${name}. Do not edit.`);
            break;
        }
    }
    return lines.join("\n");
}

const targetDir = path.join(process.cwd(), "spec");
if (!fs.existsSync(targetDir)) {
    console.error(`Missing directory "spec"`);
}
for (const [name, content] of specs.entries()) {
    const target = path.join(targetDir, name);
    if (fs.existsSync(target)) {
        const got = fs.readFileSync(target, "utf-8");
        if (got === content) {
            continue;
        }
    }
    fs.writeFileSync(target, content);
    console.log(target, "- updated");
}

