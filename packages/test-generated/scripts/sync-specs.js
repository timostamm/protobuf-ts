const fs = require("node:fs");
const path = require("node:path");

// Copy spec files from default/spec to other */spec directories.

const defaultDir = "default/spec";
const defaultSpecs = new Map(
    fs.readdirSync(defaultDir, {withFileTypes: true})
        .filter(e => e.isFile())
        .map(e => e.name)
        .filter(f => f.endsWith(".ts"))
        .map(f => [f, fs.readFileSync(path.join(defaultDir, f), "utf-8")])
        .map(([name, content]) => [name, insertNote(content, name)])
);

function insertNote(txt, name) {
    const lines = txt.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === "") {
            lines.splice(i + 1, 0, `// Copied from ${defaultDir}/${name}. Do not edit.`);
            break;
        }
    }
    return lines.join("\n");
}

const dirs = fs.readdirSync(".", {withFileTypes: true})
    .filter(e => e.isDirectory())
    .map(e => path.join(e.name, "spec"))
    .filter(dir => dir !== defaultDir)
    .filter(dir => fs.existsSync(dir));
for (const dir of dirs) {
    for (const [name, content] of defaultSpecs.entries()) {
        const target = path.join(dir, name);
        if (fs.existsSync(target)) {
            const got = fs.readFileSync(target, "utf-8");
            if (got === content) {
                continue;
            }
        }
        fs.writeFileSync(target, content);
        console.log(target, "- updated");
    }
}

