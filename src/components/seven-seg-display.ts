import { html } from 'lit-html'
import { withProps } from '../util';

interface SevenSegDisplayProps {
    display: number[];
}

export const sevenSegDisplay = withProps({

    init() {
        this.display0 = Array(6).fill(0);
        this.display = [...this.display0];
        this.blanks = 0
    },

    get observedProperties() {
        return ['digits', 'segments', 'display'];
    },

    render({ display }:SevenSegDisplayProps) {
        return html`
<div style="white-space: nowrap;">${display.map((segs:number, index:number) => html`
<span is="seven-seg" style=${index == 1 ? 'margin-left:2.2%' : ''} .segments=${segs}>
</div>`)}</span>
`;
    },

});
