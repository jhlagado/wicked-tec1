import { html } from 'lit-html'
import { withProps } from '../util';
import tec1Image from '../assets/TEC-1.jpg';

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

export const wickedTec1 = withProps({

    init: function (event) {
        this.digits = 0;
        this.segments = 0;
        this.display = Array(6).fill(0);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    },

    onconnected(event) {
        this.worker = new Worker('../worker/worker.js');
        this.worker.onmessage = event => {
            let view = new Uint8Array(event.data.buffer);
            this.digits = view[1];
            this.segments = view[2];
            this.requestRender();
            this.display = [...new Uint8Array(event.data.display)];
        }
        this.worker.postMessage({ type: 'INIT' });
        document.addEventListener("keydown", this.handleKeyDown);
    },

    ondisconnected(event) {
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

    render({ digits, segments, display }) {
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
        top: 74.4%;
        right: 42.5%;
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
        <div id="seven" is="seven-seg-display" .digits=${digits} .segments=${segments} .display=${display}></div>
    </div>
</div>
<div is="instructions" style="margin-left: 35px"></div>
`;
    },


});
