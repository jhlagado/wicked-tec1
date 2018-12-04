import { html } from 'lit-html'
import { withProps } from '../util';

export const sevenSeg = withProps({

    get observedProperties() {
        return ['segments'];
    },

    render({ segments }) {
        return html`
            <div style="display:inline-block;width:4.35%;margin-left:1.7%;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 12 20">
                    <g class="digit">
                        <polygon id="a" class=${segments & 0x01 ? 'on' : 'off'} points=" 1, 1  2, 0  8, 0  9, 1  8, 2  2, 2" />
                        <polygon id="b" class=${segments & 0x08 ? 'on' : 'off'} points=" 9, 1 10, 2 10, 8  9, 9  8, 8  8, 2" />
                        <polygon id="c" class=${segments & 0x20 ? 'on' : 'off'} points=" 9, 9 10,10 10,16  9,17  8,16  8,10" />
                        <polygon id="d" class=${segments & 0x80 ? 'on' : 'off'} points=" 9,17  8,18  2,18  1,17  2,16  8,16" />
                        <polygon id="e" class=${segments & 0x40 ? 'on' : 'off'} points=" 1,17  0,16  0,10  1, 9  2,10  2,16" />
                        <polygon id="f" class=${segments & 0x02 ? 'on' : 'off'} points=" 1, 9  0, 8  0, 2  1, 1  2, 2  2, 8" />
                        <polygon id="g" class=${segments & 0x04 ? 'on' : 'off'} points=" 1, 9  2, 8  8, 8  9, 9  8,10  2,10" />
                        <circle class=${segments & 0x10 ? 'on' : 'off'} cx="11" cy="17" r="1" />
                    </g>
                </svg>
            </div>
        `;
    },
});
