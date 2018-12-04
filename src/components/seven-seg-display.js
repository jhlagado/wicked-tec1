import { html } from 'lit-html'
import { withProps } from '../util';

export const sevenSegDisplay = withProps({

    init(event) {
        this.display0 = Array(6).fill(0);
        this.display = [...this.display0];
        this.blanks = 0
    },

    get observedProperties() {
        return ['digits', 'segments', 'display'];
    },

    render({ digits, segments, display }) {
        return html`
<div style="white-space: nowrap;">${display.map((segs, index) => html`
<span is="seven-seg" style=${index == 1 ? 'margin-left:2.2%' : ''} .segments=${segs}>
</div>`)}</span>
`;
    },

});
