import {createInterface} from "readline";


/**
 * Helps prompting for terminal input.
 */
export class TerminalIO {


    get sigint() {
        return this._sigint;
    }

    private _sigint = false;

    private readonly rli = createInterface(process.stdin, process.stdout);


    constructor() {
        this.rli.setPrompt('> ');
        this.rli.on('SIGINT', () => this._sigint = true);
    }


    print(line: string): void {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(line + "\n");
        this.rli.prompt(true);
    }


    prompt(query: string = '> '): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.rli.once('SIGINT', () => {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                reject('quit.')
            });
            this.rli.question(query, answer => {
                process.stdout.moveCursor(0, -1);
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                resolve(answer);
            });
        });
    }

}
