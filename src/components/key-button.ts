import { html } from 'lit-html'
import { withProps } from '../util';

interface KeyButtonProps {
    code: string;
    text: string;
    color: string;
    left: number;
    top: number;
}

export const keyButton = withProps({

    init(){

    },

    handleEvent(buttonEvent:any) {
        const { type } = buttonEvent;
        const event = new CustomEvent('button', {
            detail: {
                eventType: type,
                code: this.code,
            },
        });
        this.element.dispatchEvent(event);
    },

    get observedProperties() {
        return ['code','text','color','left','top'];
    },

    render({ text, color, left, top }: KeyButtonProps) {
        this.element.style = `background-color:${color};left:${left}px;top:${top}px`;
        return html`
            <div
                @mousedown=${(event:any) => this.handleEvent(event)}
                @mouseup=${(event:any) => this.handleEvent(event)}>
                    <div>${text}</div>
            </div>
        `;
    },
});
