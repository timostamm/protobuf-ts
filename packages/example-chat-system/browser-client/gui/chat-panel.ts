import {Panel} from "./panel";
import {assert} from "@protobuf-ts/runtime";


type PostCallback = (text: string) => void;
type LeaveBtnCallback = () => void;


export class ChatPanel extends Panel {


    private postCallback: PostCallback | undefined;
    private leaveBtnCallback: LeaveBtnCallback | undefined;


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
            if (this.leaveBtnCallback) {
                this.leaveBtnCallback();
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


    onPost(callback: PostCallback): void {
        this.postCallback = callback;
    }


    onLeaveBtn(callback: LeaveBtnCallback): void {
        this.leaveBtnCallback = callback;
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
