import {Router} from 'express';
import {join} from "path";


/**
 * An express Router that serves the chat client to web browsers.
 */
export const browserClientRouter = Router()

    .get('/', (req, res) => {
        const file = join(__dirname, 'index.html');
        res.sendFile(file);
    })

    .get('/index.js', (req, res) => {
        const file = join(__dirname, '.webpack-out', 'index.js');
        res.sendFile(file);
    })

    .get('/index.css', (req, res) => {
        const file = join(__dirname, 'index.css');
        res.sendFile(file);
    })

;


