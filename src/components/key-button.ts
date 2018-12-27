import { html } from 'lit-html'
import { withProps } from '../util';

interface KeyButtonProps {
    text: string;
    color: string;
    left: number;
    top: number;
}

export const keyButton = withProps({

    get observedProperties() {
        return ['text','color','left','top'];
    },

    render({ text, color, left, top }: KeyButtonProps) {
        this.element.style = `background-color:${color};left:${left}px;top:${top}px`;
        return html`
            ${text}
        `;
    },
});
