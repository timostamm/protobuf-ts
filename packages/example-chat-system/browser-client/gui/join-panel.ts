import {Panel} from "./panel";
import {assert} from "@protobuf-ts/runtime";


export class JoinPanel extends Panel {


    private startCallback: ((username: string) => void) | undefined;


    private get input(): HTMLInputElement {
        let el = this.el.getElementsByTagName('input').item(0);
        assert(el);
        return el;
    }

    private get button(): HTMLButtonElement {
        let el = this.el.getElementsByTagName('button').item(0);
        assert(el);
        return el;
    }

    private get errDiv(): HTMLDivElement {
        let el = this.el.getElementsByTagName('div').item(0);
        assert(el);
        return el;
    }


    constructor(elementId: string) {
        super(elementId);
        this.button.addEventListener('click', () => this.start());
        this.input.addEventListener('keypress', ev => {
            if (ev.key === 'Enter') {
                this.start();
            }
        });
    }


    show() {
        this.setError('');
        this.input.disabled = false;
        this.button.disabled = false;
        super.show();
        this.input.focus();
    }


    onStart(callback: (username: string) => void): void {
        this.startCallback = callback;
    }


    private start() {
        const val = this.input.value.trim();
        if (val.length == 0) {
            this.setError('Enter your username');
        } else {
            if (this.startCallback) {
                this.startCallback(val);
            }
        }
    }


    setError(message: string) {
        this.errDiv.innerText = message;
    }


    setBusy() {
        this.setError('');
        this.input.disabled = true;
        this.button.disabled = true;
    }


}
