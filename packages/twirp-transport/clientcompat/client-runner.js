#!/usr/bin/env node

let {client} = require("./client");

client().catch(reason => {
    if (reason instanceof Error) {
        process.stderr.write(`${reason.name}: ${reason.message}`);
    } else {
        process.stderr.write('failed to run: ' + reason);
    }
    process.exit(1);
});
