import {GetResponse} from "../src-gen/foo/v1/api";
import {Timestamp} from "../src-gen/google/protobuf/timestamp";


const fooGetResponse: GetResponse = {
    a: {
        a: "xx",
        b: Timestamp.now(),
    },
    b: Timestamp.now(),
}

console.log(fooGetResponse);
