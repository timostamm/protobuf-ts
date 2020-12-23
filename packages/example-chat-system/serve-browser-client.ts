import * as express from "express";
import {browserClientRouter} from "./browser-client/router";



const app = express();

const PORT = 8000;

app.use(browserClientRouter);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});



