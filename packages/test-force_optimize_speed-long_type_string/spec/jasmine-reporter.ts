import {SpecReporter, StacktraceOption} from "jasmine-spec-reporter";

// Copied from test-default/jasmine-reporter.ts. Do not edit.
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
    spec: {
        displayPending: true,
        displayStacktrace: StacktraceOption.PRETTY,
        displaySuccessful: false,
    }
}));
