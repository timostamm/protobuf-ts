const { execSync } = require("node:child_process");

if (gitUncommitted()) {
    process.stdout.write(
        "Uncommitted changes found:\n",
    );
    execSync("git --no-pager diff", {
        stdio: "inherit",
    });
    process.exit(1);
}

/**
 * @returns {boolean}
 */
function gitUncommitted() {
    const out = execSync("git status --porcelain", {
        encoding: "utf-8",
    });
    return out.trim().length > 0;
}
