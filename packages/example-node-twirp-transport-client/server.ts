import * as http from "node:http";
import {Haberdasher, Hat, Size} from "./gen/service-twirp-example";

const port = 8080;
const server = http.createServer(
    {},
    async (req, res) => {
        console.log(`${req.method} ${req.url}`);
        if (req.url != `/twirp/${Haberdasher.typeName}/MakeHat`) {
            res.writeHead(404);
            return;
        }
        if (req.headers["content-type"] != "application/protobuf") {
            res.writeHead(415);
            return;
        }
        if (req.method != "POST") {
            res.writeHead(405);
            return;
        }
        const body = await new Promise<Uint8Array>((resolve, reject) => {
            const chunks: Buffer[] = [];
            req.on("error", reject);
            req.on("data", (chunk) => chunks.push(chunk));
            req.on("end", () => resolve(Buffer.concat(chunks)));
        });
        const size = Size.fromBinary(body);
        const hat = Hat.create({
            size: size.inches,
            color: "red",
            name: "joe",
        });
        res.writeHead(200, {
           ["content-type"]: "application/proto",
        });
        res.write(Hat.toBinary(hat));
        res.end();
    },
);

server.on("error", (err) => {
    console.error(err);
});

server.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`);
});
