// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
// uses "karma-typescript" to transpile, see:
// https://github.com/monounity/karma-typescript/tree/master/packages/karma-typescript


module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            "spec/**/*.ts",
            "src/**/*.ts",
        ],
        exclude: [
            "spec/support/reporter.ts",
        ],
        preprocessors: {
            "/**/*.ts": "karma-typescript",
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["ChromeHeadless"],
        singleRun: true,
        karmaTypescriptConfig: {
            coverageOptions: {
                exclude: [
                    /(^|\/)spec\//i,
                ]
            },
            tsconfig: './tsconfig.test.json'
        },
        client: {
            // jasmine: require('./jasmine.json')
        }
    });
};

