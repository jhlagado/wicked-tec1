import { html } from 'lit-html'
import { withProps } from '../util';

export const keyButton = withProps({

    get observedProperties() {
        return ['text','color','left','top'];
    },

    render({ text, color, left, top }) {
        return html`
            <div style="background-color:${color};left:${left}px;top:${top}px">
                ${text}
            </div>
        `;
    },
});
