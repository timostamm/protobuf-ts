import {readdirSync, readFileSync, statSync, writeFileSync} from "fs";
import {join} from "path";

const testeesPath = "./testees";
const exclude = ["protobuf-ts.size-bigint", "protobuf-ts.speed-bigint"];

const testees: Testee[] = readdirSync(testeesPath, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => !exclude.includes(dirent.name))
    .map(dirent => {
        const pluginName = dirent.name.split(".")[0];
        return {
            id: dirent.name,
            pluginName,
            pluginPackage: pluginNameToPackageName(pluginName),
            pluginVersion: pluginNameToVersion(pluginName),
            pluginParameter: readFileSync(join(testeesPath, dirent.name, ".plugin-out/parameters.txt"), "utf-8").trim(),
            webpackFileSize: statSync(join(testeesPath, dirent.name, ".webpack-out/index.js")).size,
            webpackLog: readFileSync(join(testeesPath, dirent.name, ".webpack-out/webpack.log"), "utf-8").trim()
        };
    })
    .sort((a, b) => a.webpackFileSize - b.webpackFileSize);


console.log(makeReportTable(testees));

writeFileSync('code-size-report.md', makeFullReport(testees));


interface Testee {
    id: string;
    pluginName: string;
    pluginPackage: string;
    pluginVersion: string;
    pluginParameter: string;
    webpackFileSize: number;
    webpackLog: string;
}


function makeFullReport(testees: Testee[]): string {
    const lines = [];
    lines.push('Code size report');
    lines.push('================');
    lines.push();
    lines.push();
    lines.push(makeReportTable(testees));
    for (const testee of testees) {
        lines.push();
        lines.push();
        lines.push(makeReportDetails(testee));
    }
    return lines.join("\n");
}

function makeReportTable(testees: Testee[]): string {
    const lines = [];
    lines.push('| generator               |                 version | parameter               |     webpack output size |');
    lines.push('|-------------------------|------------------------:|-------------------------|------------------------:|');
    for (let testee of testees) {
        lines.push(`| ${testee.pluginName} | ${testee.pluginVersion} | ${testee.pluginParameter} | ${new Intl.NumberFormat().format(testee.webpackFileSize)} b |`);
    }
    return lines.join("\n");
}

function makeReportDetails(testee: Testee): string {
    const nf = new Intl.NumberFormat();
    const lines = [];
    lines.push(`${testee.id}`);
    lines.push("=".repeat(testee.id.length));
    lines.push();
    lines.push(`Plugin name: ${testee.pluginName}  `);
    lines.push(`Plugin version: ${testee.pluginVersion}  `);
    lines.push(`Plugin parameters: ${testee.pluginParameter}  `);
    lines.push(`Webpack file size: ${nf.format(testee.webpackFileSize)} b  `);
    lines.push();
    lines.push(`#### Webpack log`);
    lines.push("```");
    lines.push(testee.webpackLog);
    lines.push("```");
    return lines.join("\n");
}

function pluginNameToPackageName(pluginName: string): string {
    switch (pluginName) {
        case "protobuf-ts":
            return '@protobuf-ts/plugin';
        default:
            return pluginName;
    }
}

function pluginNameToVersion(pluginName: string): string {
    const packageName = pluginNameToPackageName(pluginName);
    return require(`${packageName}/package.json`).version;
}
