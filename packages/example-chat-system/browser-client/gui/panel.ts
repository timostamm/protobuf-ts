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
