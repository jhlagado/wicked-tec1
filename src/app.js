import wickedElements from 'wicked-elements';
import tec1Image from './assets/TEC-1.jpg';
import { html, render } from 'lit-html'
import { withProps } from './util';

const byteToHex = (byte) => (byte & 0xff).toString(16).padStart(2, '0');
const wordToHex = (word) => (word & 0xffff).toString(16).padStart(4, '0');

const keyMap = {
    Digit0: 0x00, Digit1: 0x01, Digit2: 0x02, Digit3: 0x03,
    Digit4: 0x04, Digit5: 0x05, Digit6: 0x06, Digit7: 0x07,
    Digit8: 0x08, Digit9: 0x09,
    KeyA: 0x0A, KeyB: 0x0B, KeyC: 0x0C, KeyD: 0x0D,
    KeyE: 0x0E, KeyF: 0x0F,
    Space: 0x13, Tab: 0x13,
    Enter: 0x12, Minus: 0x11,
    ArrowDown: 0x11, ArrowUp: 0x10,
};

export function initApp() {

    wickedElements.define('[is="wicked-tec1"]', withProps({

        init: function (event) {
            this.digits = 0;
            this.segments = 0;
            this.rando = 0;
            this.handleKeyDown = this.handleKeyDown.bind(this);
        },

        onconnected(event) {
            // console.log('on connected');
            this.worker = new Worker('./worker/worker.js');
            this.worker.onmessage = event => {
                let view = new Uint8Array(event.data.buffer);
                this.digits = view[1];
                this.segments = view[2];
                this.rando = view[3];
                this.requestRender();
            }
            this.worker.postMessage({ type: 'INIT' });
            document.addEventListener("keydown", this.handleKeyDown);
        },

        ondisconnected(event) {
            // console.log('on disconnected');
            this.worker.terminate();
            document.removeEventListener("keydown", this.handleKeyDown);
        },

        handleKeyDown(event) {

            if (event.code === 'Escape') {
                this.worker.postMessage({ type: 'RESET' });
                event.preventDefault();
            }
            if (event.code === 'KeyQ') {
                if (event.ctrlKey) {
                    this.worker.postMessage({ type: 'EXIT' });
                }
                event.preventDefault();
            }
            else if (event.code in keyMap) {
                let keyCode = keyMap[event.code];
                if (event.shiftKey) {
                    keyCode = keyCode | 0x80;
                }
                this.worker.postMessage({ type: 'SET_INPUT_VALUE', port: 0, value: keyCode });
                this.worker.postMessage({ type: 'NMI' });
                event.preventDefault();
            }
            else {
                console.log(event, event.code, event.key);
            }
        },

        render({ digits, segments, rando }) {
            return html`
<div>digits ${digits} segments ${segments}</div>
<style>
    #tec1 {
        width: 600px;
        height: 375px;
        background-image: url(${tec1Image});
        background-size: 100% 100%;
    }

    #digitPane {
        direction: rtl;
        padding: 0px 20px;
        position: relative;
        top: 279px;
        right: 255px;
    }

    .off {
        fill: #320000;
    }

    .on {
        fill: red;
    }
</style>
<div id="tec1">
    <div id="digitPane">
        <div id="seven" is="seven-seg-display" .digits=${digits} .segments=${segments}></div>
    </div>
</div>
<div className="App">
    <header className="App-header">
        <h1>TEC-1</h1>
        <table style="width: 600px">
            <tbody>
                <tr>
                    <th>Key</th>
                    <th>Description</th>
                    <th>TEC-1</th>
                </tr>
                <tr>
                    <td>0-9,A-F</td>
                    <td>Hex digits</td>
                    <td></td>
                </tr>
                <tr>
                    <td>ESC</td>
                    <td>Reset</td>
                    <td>(RES)</td>
                </tr>
                <tr>
                    <td>tab</td>
                    <td>Mode</td>
                    <td>(AD)</td>
                </tr>
                <tr>
                    <td>Enter</td>
                    <td>Run</td>
                    <td>(GO)</td>
                </tr>
                <tr>
                    <td>Arrow Up</td>
                    <td>Increase</td>
                    <td>(+)</td>
                </tr>
                <tr>
                    <td>Arrow Down</td>
                    <td>Decrease</td>
                    <td>(-)</td>
                </tr>
                <tr>
                    <td>Ctrl-Q</td>
                    <td>Terminate</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </header>
</div>
`;
        },
    }));

    // <div>PC: ${wordToHex(PC)}</div>
    // <div>A: ${byteToHex(A)}</div>
    // <div>HL: ${byteToHex(HL)}</div>
    // <div>digits: ${digits.toString(2).padStart(8, '0')}</div>
    // <div>digits: ${digits.toString(2).split()}</div>
    // <div>segments: ${segments.toString(2).padStart(8, '0')}</div>
    // <div>Speaker: ${frequency}</div>
    // <div>Displays: ${displays.map(item => byteToHex(item))}</div>



    wickedElements.define('[is="seven-seg-display"]', withProps({

        init(event) {
            this.display0 = Array(6).fill(0);
            this.display = [...this.display0];
            this.blanks = 0
        },

        get observedProperties() {
            return ['digits', 'segments'];
        },

        propertyChanged(prop, newValue, oldValue) {
            let mask = 0x01;
            for (let i = 0; i < 6; i++) {
                if (this.digits & mask)
                    this.display0[i] = this.segments;
                mask = mask << 1;
            }
            this.display = [...this.display0];
        },

        render({ digits, segments, display }) {
            return html`
<div style="white-space: nowrap;">${display.map((segs, index) => html`
    <span is="seven-seg" style=${index == 1 ? 'margin-left:13px' : ''} .segments=${segs}>
</div>`)}</span>
`;
        },
    }));

    wickedElements.define('[is="seven-seg"]', withProps({

        // init(event) {
        //     // console.log('init 7seg');
        // },

        get observedProperties() {
            return ['segments'];
        },

        propertyChanged(prop, newValue, oldValue) {
            // console.log(`property changed ${prop} ${newValue} ${oldValue} `);
        },

        render({ segments }) {
            return html`
                <div style="display:inline-block;width:24px;margin-left:10px;">
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

    }));
};
