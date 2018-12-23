import { html } from 'lit-html'
import { withProps, isHidden, addVisibilityListener, removeVisiblityListener } from '../util';
import tec1Image from '../assets/TEC-1.jpg';
import {audioInit, audioPlay, audioValue} from '../util/audio';

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
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.classic = localStorage.getItem('classic') === 'true';
        this.speed = localStorage.getItem('speed');
        this.shiftLocked = false;
    },

    onconnected(event) {
        this.worker = new Worker('../worker/worker.js');
        this.worker.onmessage = event => {
            let view = new Uint8Array(event.data.buffer);
            this.digits = view[1];
            this.segments = view[2];
            this.requestRender();
            this.display = [...new Uint8Array(event.data.display)];
            this.wavelength = event.data.wavelength;
            this.frequency = this.wavelength ? 500000/this.wavelength : 0;
            audioValue(this.frequency);
        }
        this.worker.postMessage({ type: 'INIT' });
        this.postSpeed(this.speed);
        document.addEventListener("keydown", this.handleKeyDown);
        addVisibilityListener(this.handleVisibility);
    },

    ondisconnected(event) {
        this.worker.terminate();
        document.removeEventListener("keydown", this.handleKeyDown);
        removeVisiblityListener(this.handleVisibility);
    },

    handleVisibility() {
        console.log('isHidden', isHidden());
        audioPlay(!isHidden());
        this.worker.postMessage({ type: 'HIDDEN', value: isHidden() });
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
        audioInit();
        if (code === 'Escape') {
            this.worker.postMessage({ type: 'RESET' });
            return true;
        }
        if (code === 'Space') {
            this.worker.postMessage({ type: 'PAUSE' });
            return true;
        }
        if (code === 'ShiftLock') {
            this.shiftLocked = !this.shiftLocked;
            return true;
        }
        else if (code in keyMap) {
            let keyCode = keyMap[code];
            if (shiftKey) {
                this.shiftLocked = true;;
            }
            const bit5 = 0b00100000;
            const keyCode1 = this.shiftLocked ?
                keyCode & ~bit5 :
                keyCode | bit5;
            this.shiftLocked = false;
            this.worker.postMessage({ type: 'SET_INPUT_VALUE', port: 0, value: keyCode1 });
            this.worker.postMessage({ type: 'NMI' });
            return true;
        }
    },

    handleUpload(event) {
        const files = event.target.files;
        if (files == null || files.length === 0) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
            this.worker.postMessage({ type: 'UPDATE_MEMORY', value: reader.result });
        }
        reader.readAsText(file);
    },

    postSpeed(speed) {
        this.worker.postMessage({ type: 'SET_SPEED', value: speed });
    },

    render({ digits, segments, display, shiftLocked }) {
        return html`
<style>
    body {
        font-family: sans-serif;
    }
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

    [is=key-button] {
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
<div style="display:inline-block">
    <div id="tec1">
        ${  this.classic ?
            html`<div is="keypad-classic" @click=${(event) => this.handleButton(event.detail.code)}></div>` :
            html`<div is="keypad-modern" @click=${(event) => this.handleButton(event.detail.code)}></div>`
        }
        <div is="key-button" .text=${ 'R'}  .color=${ '#cd3d45'} .left=${349} .top=${301} @click=${() => this.handleButton('Escape')}></div>
        <div is="key-button" .text=${ 'SH'}  .color=${ shiftLocked ? '#d8696f' : '#cd3d45'} .left=${386} .top=${333} @click=${() => this.handleButton('ShiftLock')}></div>

        <div id="digitPane">
            <div id="seven" is="seven-seg-display" .digits=${digits} .segments=${segments} .display=${display}></div>
        </div>
    </div>
    <div style="display:flex; justify-content:space-between;">
        <div>
            <input type="checkbox"
                ?checked=${this.classic}
                @change=${event => {
                    this.classic = event.target.checked;
                    localStorage.setItem('classic', String(this.classic))
                }}
                >original key layout
        </div>
        <input type="file" @change=${event => this.handleUpload(event)}>
        <div>
            Speed
            <input
                type="range"
                min="0"
                max="99"
                value=${this.speed || "50"}
                @change=${event => {
                    this.speed = event.target.value;
                    localStorage.setItem('speed', String(this.speed))
                    this.worker.postMessage({ type: 'SET_SPEED', value: this.speed });
                    this.postSpeed(this.speed);
                }}
                >
        </div>
    </div>
    <p>MON 1 Restarts:</p>
    <div style="display:flex; justify-content:space-between">
        <div>
            <div>CF (RST 1)	INVADERS</div>
            <div>D7 (RST 2)	NIM</div>
            <div>DF (RST 3)	LUNALANDER</div>
        </div>
        <div>
            <div>EF (RST 5)	TUNE 1 Bealach An Doirín</div>
            <div>F7 (RST 6)	TUNE 2 Biking up the Strand</div>
        </div>
    </div>
</div>
<!-- <div is="instructions" style="margin-left: 35px"></div> -->
`;
    },
});
