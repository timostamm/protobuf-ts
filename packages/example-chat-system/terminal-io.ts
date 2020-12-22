import {createInterface} from "readline";


/**
 * Helps prompting for terminal input.
 */
export class TerminalIO {


    get closed() {
        return this._closed;
    }

    private _closed = false;

    private readonly rli = createInterface(process.stdin, process.stdout);


    constructor() {
        this.rli.setPrompt('> ');
        this.rli.on('SIGINT', () => this.close());
    }


    close(): void {
        this._closed = true;
        this.rli.close();
    }


    print(line: string): void {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(line + "\n");
        this.rli.prompt(true);
    }


    prompt(query: string = '> '): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const cb = () => {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                reject('SIGINT')
            };
            this.rli.once('SIGINT', cb);
            this.rli.question(query, answer => {
                process.stdout.moveCursor(0, -1);
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                this.rli.off('SIGINT', cb);
                resolve(answer);
            });
        });
    }

}
