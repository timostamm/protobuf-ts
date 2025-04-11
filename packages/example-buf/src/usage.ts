import {GetResponse} from "./gen/foo/v1/api";
import {Timestamp} from "./gen/google/protobuf/timestamp";


const fooGetResponse: GetResponse = {
    a: {
        a: "xx",
        b: Timestamp.now(),
    },
    b: Timestamp.now(),
}

console.log(fooGetResponse);
