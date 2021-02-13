import * as express from "express";
import * as path from "path";



const app = express();

const PORT = 8000;

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});



