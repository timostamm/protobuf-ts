import {readdirSync, statSync, writeFileSync} from "fs";
import {execSync} from "child_process";


type Testee = {
    id: string;
    file: string;
    name: string;
    version: string;
    options: string[];
}

type Stat = {
    testee: Testee
    webpackLog: string;
    byteSize: number;
}


let testees: Testee[] = readdirSync("./testees")
    .filter(file => file.endsWith(".code-size.ts") || file.endsWith("code-size-wkt.ts") || file.endsWith("code-size.js"))
    .map(file => {
        let id = file.substring(0, file.indexOf('.code-size'));
        let version: string;
        let options = [];
        let name = id;
        switch (id) {
            case "pbf":
                version = require('pbf/package.json').version;
                break;
            case "google-protobuf":
                version = require('google-protobuf/package.json').version;
                break;
            case "ts-proto":
                version = require('ts-proto/package.json').version;
                break;
            default:
                name = 'protobuf-ts';
                version = require('@protobuf-ts/plugin/package.json').version;
                if (id.includes("speed"))
                    options.push("speed");
                if (id.includes("size"))
                    options.push("size");
                break;
        }
        return {id, file, name, version, options};
    });


let stats: Array<Stat> = [];

for (let testee of testees) {
    if (!testee.file.endsWith('.ts')) continue;
    let command = `npx tsc --rootDir ./ --baseUrl ./ --strict --module ES2015 --target ES2015 --moduleResolution node \
    testees/${testee.file} --outDir ./.code-size/tsc-out`;
    try {
        execSync(command, {encoding: "utf8"});
    } catch (e) {
        console.log("WARN " + e.message);
    }
}

for (let testee of testees) {
    let wpOutput = `.code-size/webpack-out/${testee.file.substring(0, testee.file.length - 3)}.min.js`;
    let wpInput = `./testees/${testee.file}`;
    if (testee.file.endsWith('ts')) {
        wpInput = `.code-size/tsc-out/testees/${testee.file.substring(0, testee.file.length - 3)}.js`;
    }
    let command = `npx webpack --mode=production \
    --display-used-exports=true \\
    --display-provided-exports=true \\
    --display-optimization-bailout=true \\
    --display-entrypoints=false \\
    --display-chunks=false \\
    --display-modules=true --display-max-modules 999 \\
    --display-reasons=false \\
    --config webpack.config.js \\
    --output ${wpOutput} \\
    ${wpInput}`;
    let webpackLog = execSync(command, {encoding: "utf8"});
    let byteSize = statSync(wpOutput).size;
    stats.push({testee, webpackLog, byteSize});
}

stats.sort((a, b) => a.byteSize - b.byteSize);

let text = '| generator               | version         | optimize for      | webpack output size |\n';
text +=    '|-------------------------|----------------:|-------------------|--------------------:|\n';
for (let stat of stats) {
    text += `| ${stat.testee.name} | ${stat.testee.version} | ${stat.testee.options.join(', ')} | ${new Intl.NumberFormat().format(stat.byteSize)} b |\n`;
}

console.log(text);

for (let stat of stats) {
    text += '\n';
    text += '\n';
    text += '\n';
    text += `### ${stat.testee.file} webpack report\n`;
    text += '```\n';
    text += stat.webpackLog;
    text += '```\n';
}

writeFileSync('code-size-report.md', text);
