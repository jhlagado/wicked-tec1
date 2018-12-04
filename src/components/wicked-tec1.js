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

        if (this.handleButton(event.code, event.shiftKey, event.ctrlKey)) {
            event.preventDefault();
        }
        else {
            console.log(event, event.code, event.key);
        }
    },

    handleButton(code, shiftKey, ctrlKey) {
        if (code === 'Escape') {
            this.worker.postMessage({ type: 'RESET' });
        }
        if (code === 'KeyQ') {
            if (ctrlKey) {
                this.worker.postMessage({ type: 'EXIT' });
            }
        }
        else if (code in keyMap) {
            let keyCode = keyMap[code];
            if (shiftKey) {
                keyCode = keyCode | 0x80;
            }
            this.worker.postMessage({ type: 'SET_INPUT_VALUE', port: 0, value: keyCode });
            this.worker.postMessage({ type: 'NMI' });
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
        position: relative;
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

    [is=key-button] {
        height: 0px;
    }

    [is=key-button]>div {
        position: absolute;
        background-color: #cd3d45;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: sans-serif;
        font-size: 13px;
        font-weight: bold;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        left: 438px;
        top: 301px;
    }
</style>
<div id="tec1">

    <div is="key-button" .text=${ 'AD'} .color=${ '#cd3d45'} .left=${438} .top=${239} @click=${() => this.handleButton('Tab')}></div>
    <div is="key-button" .text=${ '3'} .color=${ '#efedeb'} .left=${468} .top=${239} @click=${() => this.handleButton('Digit3')}></div>
    <div is="key-button" .text=${ '7'}  .color=${ '#efedeb'} .left=${500} .top=${239} @click=${() => this.handleButton('Digit7')}></div>
    <div is="key-button" .text=${ 'B'} .color=${ '#efedeb'} .left=${531} .top=${239} @click=${() => this.handleButton('KeyB')}></div>
    <div is="key-button" .text=${ 'F'} .color=${ '#efedeb'} .left=${562} .top=${239} @click=${() => this.handleButton('KeyF')}></div>

    <div is="key-button" .text=${ 'GO'} .color=${ '#cd3d45'} .left=${438} .top=${270} @click=${() => this.handleButton('Enter')}></div>
    <div is="key-button" .text=${ '2'} .color=${ '#efedeb'} .left=${468} .top=${270} @click=${() => this.handleButton('Digit2')}></div>
    <div is="key-button" .text=${ '6'} .color=${ '#efedeb'} .left=${500} .top=${270} @click=${() => this.handleButton('Digit6')}></div>
    <div is="key-button" .text=${ 'A'} .color=${ '#efedeb'} .left=${531} .top=${270} @click=${() => this.handleButton('KeyA')}></div>
    <div is="key-button" .text=${ 'E'} .color=${ '#efedeb'} .left=${562} .top=${270} @click=${() => this.handleButton('KeyE')}></div>

    <div is="key-button" .text=${ '-'}  .color=${ '#cd3d45'} .left=${438} .top=${301} @click=${() => this.handleButton('ArrowDown')}></div>
    <div is="key-button" .text=${ '1'} .color=${ '#efedeb'} .left=${468} .top=${301} @click=${() => this.handleButton('Digit1')}></div>
    <div is="key-button" .text=${ '5'} .color=${ '#efedeb'} .left=${500} .top=${301} @click=${() => this.handleButton('Digit5')}></div>
    <div is="key-button" .text=${ '9'} .color=${ '#efedeb'} .left=${531} .top=${301} @click=${() => this.handleButton('Digit9')}></div>
    <div is="key-button" .text=${ 'D'} .color=${ '#efedeb'} .left=${562} .top=${301} @click=${() => this.handleButton('KeyD')}></div>

    <div is="key-button" .text=${ '+'}  .color=${ '#cd3d45'} .left=${438} .top=${332} @click=${() => this.handleButton('ArrowUp')}></div>
    <div is="key-button" .text=${ '0'} .color=${ '#efedeb'} .left=${468} .top=${332} @click=${() => this.handleButton('Digit0')}></div>
    <div is="key-button" .text=${ '4'} .color=${ '#efedeb'} .left=${500} .top=${332} @click=${() => this.handleButton('Digit4')}></div>
    <div is="key-button" .text=${ '8'} .color=${ '#efedeb'} .left=${531} .top=${332} @click=${() => this.handleButton('Digit8')}></div>
    <div is="key-button" .text=${ 'C'} .color=${ '#efedeb'} .left=${562} .top=${332} @click=${() => this.handleButton('KeyC')}></div>

    <div is="key-button" .text=${ 'R'}  .color=${ '#cd3d45'} .left=${349} .top=${301} @click=${() => this.handleButton('Escape')}></div>

    <div id="digitPane">
        <div id="seven" is="seven-seg-display" .digits=${digits} .segments=${segments} .display=${display}></div>
    </div>
</div>
<div is="instructions" style="margin-left: 35px"></div>
`;
    },
});
