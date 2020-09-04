import {SpecReporter, StacktraceOption} from "jasmine-spec-reporter";

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
    spec: {
        displayPending: true,
        displayStacktrace: StacktraceOption.PRETTY,
        displaySuccessful: false,
    }
}));
