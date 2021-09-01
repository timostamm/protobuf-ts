import {ExampleServiceClient, ServiceError, Status} from "../gen/service-example_pb_service";
import * as service_example_pb from "../gen/service-example_pb";
import {grpc} from "@improbable-eng/grpc-web";

// passed through from environment variable SERVICE_URL
declare const SERVICE_URL: string;

const client = new ExampleServiceClient(SERVICE_URL, {
    debug: true,
    transport: grpc.WebsocketTransport(),
});

Promise.resolve(null)
    .then(() => run(unary))
    .then(() => run(serverStream))
    .then(() => run(clientStream))
    .then(() => run(bidi))
;


function unary(log: LogFn, finish: FinishFn): void {
    log("### unary()");
    const req = new service_example_pb.ExampleRequest();
    req.setQuestion("hello?");
    client.unary(req, (error: ServiceError | null, responseMessage: service_example_pb.ExampleResponse | null) => {
        if (responseMessage) {
            finish(
                true,
                JSON.stringify(responseMessage.toObject(), null, 2)
            );
        }
        if (error) {
            finish(
                false,
                `${error.code} ${error.message}`
            );
        }
    });
}


function serverStream(log: LogFn, finish: FinishFn): void {
    log("### serverStream()");
    const req = new service_example_pb.ExampleRequest();
    req.setQuestion("hello?");
    //req.setPleaseFail(1);
    const responseStream = client.serverStream(req);
    responseStream.on("data", (message: service_example_pb.ExampleResponse) => {
        log("received message: " + JSON.stringify(message.toObject(), null, 2));
    });
    responseStream.on("status", (status: Status) => {
        log(`received status: ${status.code} ${status.details}`);
    });
    responseStream.on("end", (status?: Status) => {
        if (status && status.code > 0) {
            finish(false, `end: ${status?.code} ${status?.details}`);
        } else {
            finish(true, "");
        }
    });
}


function clientStream(log: LogFn, finish: FinishFn): void {
    log("### clientStream()");

    const requestStream = client.clientStream();

    requestStream.on("status", (status: Status) => {
        log(`received status: ${status.code} ${status.details}`);
    });

    requestStream.on("end", (status?: Status) => {
        if (status && status.code > 0) {
            finish(false, `request stream ended: ${status?.code} ${status?.details}`);
        } else {
            finish(true, "request stream ended");
        }
    });

    setTimeout(() => {
        log("sending question a");
        const req = new service_example_pb.ExampleRequest();
        req.setQuestion("a?");
        requestStream.write(req);
    }, 250);

    setTimeout(() => {
        log("sending question b");
        const req = new service_example_pb.ExampleRequest();
        req.setQuestion("b?");
        requestStream.write(req);
    }, 500);

    setTimeout(() => {
        log("ending request stream");
        requestStream.end();
    }, 750);
}


function bidi(log: LogFn, finish: FinishFn): void {
    log("### bidi()");

    const bidiStream = client.bidi();

    bidiStream.on("data", (message: service_example_pb.ExampleResponse) => {
        log("received message: " + JSON.stringify(message.toObject(), null, 2));
    });
    bidiStream.on("status", (status: Status) => {
        log(`received status: ${status.code} ${status.details}`);
    });
    bidiStream.on("end", (status?: Status) => {
        if (status && status.code > 0) {
            finish(false, `bidi stream ended: ${status?.code} ${status?.details}`);
        } else {
            finish(true, "bidi stream ended");
        }
    });

    setTimeout(() => {
        log("sending question a");
        const req = new service_example_pb.ExampleRequest();
        req.setQuestion("a?");
        bidiStream.write(req);
    }, 250);

    setTimeout(() => {
        log("sending question b");
        const req = new service_example_pb.ExampleRequest();
        req.setQuestion("b?");
        bidiStream.write(req);
    }, 500);

    setTimeout(() => {
        log("ending request stream");
        bidiStream.end();
    }, 750);
}


type LogFn = (message: string) => void;
type FinishFn = (success: boolean, message: string) => void;
type RunnerFn = (log: LogFn, finish: FinishFn) => void;

function run(runner: RunnerFn): Promise<void> {
    return new Promise<void>((resolve) => {
        runner(
            (message: string) => {
                logPre(message);
            },
            (success: boolean, message: string) => {
                if (success) {
                    logPre(message);
                } else {
                    logPre(message).style.color = "red";
                    showErrorHeader();
                }
                logPre("");
                resolve();
            },
        );
    });
}

function logPre(message: string): HTMLPreElement {
    const el = document.createElement("pre");
    el.innerText = message;
    document.getElementsByTagName("body")[0].appendChild(el);
    return el;
}

function showErrorHeader(): void {
    let header = document.getElementById("error-header");
    if (header instanceof HTMLPreElement) {
        return;
    }
    const el = document.createElement("pre");
    el.id = "error-header";
    el.style.color = "red";
    el.innerText = "one or more requests failed";
    document.getElementsByTagName("body")[0].prepend(el);
}
