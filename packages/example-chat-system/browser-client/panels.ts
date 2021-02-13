import {assert} from "@protobuf-ts/runtime";


export abstract class Panel {


    protected readonly el: HTMLElement;


    protected constructor(elementId: string) {
        let el = document.getElementById(elementId);
        assert(el);
        this.el = el;
    }

    show(): void {
        this.el.style.removeProperty('display');
    }

    hide(): void {
        this.el.style.display = 'none';
    }

}


type PostCallback = (text: string) => void;
type LeaveBtnCallback = () => void;

export class ChatPanel extends Panel {


    postCallback: PostCallback | undefined;
    leaveCallback: LeaveBtnCallback | undefined;


    private get input(): HTMLInputElement {
        let el = this.el.getElementsByTagName('input').item(0);
        assert(el);
        return el;
    }

    private get list(): HTMLUListElement {
        let el = this.el.getElementsByTagName('ul').item(0);
        assert(el);
        return el;
    }

    private get leaveBtn(): HTMLButtonElement {
        let el = this.el.getElementsByTagName('button').item(0);
        assert(el);
        return el;
    }


    constructor(elementId: string) {
        super(elementId);
        this.input.addEventListener('keypress', ev => {
            if (ev.key === 'Enter') {
                this.post();
            }
        });
        this.list.innerHTML = '';
        this.leaveBtn.addEventListener('click', () => {
            if (this.leaveCallback) {
                this.leaveCallback();
            }
        });
    }


    private post() {
        let val = this.input.value.trim();
        if (this.postCallback && val.length) {
            this.postCallback(this.input.value);
            this.input.value = '';
        }
    }


    show() {
        this.list.innerHTML = '';
        this.input.value = '';
        super.show();
        this.input.focus();
    }


    addMessage(username: string, message: string): void {
        let template = document.createElement('template');
        template.innerHTML = `
        <li class="event-message">
            <span>username:</span>
            <span>message text 1</span>
        </li>
        `.trim();
        let li = template.content.firstChild as HTMLLIElement;
        let spans = li.getElementsByTagName('span');
        spans[0].innerText = username;
        spans[1].innerText = message;
        this.list.appendChild(li);
    }


    addOther(message: string): void {
        let template = document.createElement('template');
        template.innerHTML = `
        <li class="event-other">
        </li>
        `.trim();
        let li = template.content.firstChild as HTMLLIElement;
        li.innerText = message;
        this.list.appendChild(li);
    }


}


export class JoinPanel extends Panel {


    startCallback: ((username: string) => void) | undefined;


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
