import { html } from 'lit-html'
import { withProps, isHidden, addVisibilityListener, removeVisiblityListener } from '../util';
import tec1Image from '../../assets/TEC-1.jpg';
import {audioInit, audioPlay, audioValue} from '../util/audio';
// @ts-ignore: Module '"nrf-intel-hex"' has no default export
import MemoryMap from 'nrf-intel-hex';

interface Message {
    type: string;
}

interface MemoryMessage extends Message {
    type: 'POST_MESSAGE';
    from: number;
    size: number;
    buffer: ArrayBuffer;
}

interface CPUMessage extends Message {
    type: 'POST_OUTPORTS';
    buffer: ArrayBuffer;
    display: ArrayBuffer;
    wavelength: any;
}

interface KeyMap {
    [key: string]: number | null;
}

const keyMap:KeyMap = {
    Digit0: 0x00, Digit1: 0x01, Digit2: 0x02, Digit3: 0x03,
    Digit4: 0x04, Digit5: 0x05, Digit6: 0x06, Digit7: 0x07,
    Digit8: 0x08, Digit9: 0x09,
    KeyA: 0x0A, KeyB: 0x0B, KeyC: 0x0C, KeyD: 0x0D,
    KeyE: 0x0E, KeyF: 0x0F,
    Space: 0x13, Tab: 0x13,
    Enter: 0x12, Minus: 0x11,
    ArrowDown: 0x11, ArrowUp: 0x10,
};

interface AppRootProps {
    digits: number[];
    segments: number[];
    display: number[];
    shiftLocked: boolean;
}

const anchor = document.createElement('a');

export const Tec1App = withProps({

    init: function () {
        this.digits = 0;
        this.segments = 0;
        this.display = Array(6).fill(0);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.classic = localStorage.getItem('classic') === 'true';
        this.speed = localStorage.getItem('speed');
        this.shiftLocked = false;
    },

    onconnected() {
        this.worker = new Worker('../worker/worker.ts');
        this.worker.onmessage = (event: { data: CPUMessage | MemoryMessage }) => {
            if (event.data.type === 'POST_OUTPORTS') {
                const {
                        buffer,
                        display,
                        wavelength,
                } = event.data;
                let view = new Uint8Array(buffer);
                this.digits = view[1];
                this.segments = view[2];
                this.requestRender();
                this.display = [...new Uint8Array(display)];
                this.wavelength = wavelength;
                this.frequency = this.wavelength ? 500000/this.wavelength : 0;
                audioValue(this.frequency);
            }
            else {
                const {
                    from,
                    buffer,
                } = event.data;
                let memMap = new MemoryMap();
                let bytes = new Uint8Array(buffer);
                memMap.set(from, bytes);

                anchor.download = `TEC-1-${(new Date).getTime()}.hex`;
                let hexString = memMap.asHexString();
                anchor.href = URL.createObjectURL(new Blob([hexString], {type: 'application/octet-stream'}));
                anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
                anchor.click();
            }
        }
        this.worker.postMessage({ type: 'INIT' });
        this.postSpeed(this.speed);
        this.handleChangeROM('MON-1');

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
        addVisibilityListener(this.handleVisibility);
    },

    ondisconnected() {
        this.worker.terminate();
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyDown);
        removeVisiblityListener(this.handleVisibility);
    },

    handleVisibility() {
        console.log('isHidden', isHidden());
        audioPlay(!isHidden());
        this.worker.postMessage({ type: 'HIDDEN', value: isHidden() });
    },

    handleKeyDown(event: any) {

        if (this.handleCode(event.code, event.shiftKey)) {
            event.preventDefault();
        }
        else {
            console.log(event, event.code, event.key);
        }
    },

    handleButton(event: any) {
        // console.log(event.detail)
        const {code, eventType} = event.detail;
        const pressed = eventType === 'mousedown';
        if (this.handleCode(code, pressed, event.shiftKey)) {
            event.preventDefault();
        }
    },

    handleCode(code:string, pressed:boolean, shiftKey:boolean) {
        audioInit();
        pressed;
        if (code === 'Escape') {
            this.worker.postMessage({ type: 'RESET' });
            return true;
        }
        else if (code === 'ShiftLock') {
            if (pressed) this.shiftLocked = !this.shiftLocked;
            return true;
        }
        else if (code in keyMap) {
            let keyCode = keyMap[code];
            if (keyCode == null)
                return false;
            if (shiftKey) {
                this.shiftLocked = true;
            }
            const bit5 = 0b00100000;
            const mask = ~bit5;
            let keyCode1 = keyCode & mask;
            if (!this.shiftLocked) keyCode1 = keyCode1 | bit5;
            this.shiftLocked = false;
            this.worker.postMessage({ type: 'SET_INPUT_VALUE', port: 0, value: keyCode1 });
            this.worker.postMessage({ type: 'SET_KEY_VALUE', code: keyCode1, pressed });
            if (pressed) this.worker.postMessage({ type: 'NMI' });
            return true;
        }
        return false;
    },

    handleChangeROM(name:string) {
        const p:Promise<{ROM:string}> =
            (name == 'MON-1A') ? import('../roms/MON-1A') :
            (name == 'MON-1B') ? import('../roms/MON-1B') :
            (name == 'MON-2') ? import('../roms/MON-2') :
            (name == 'JMON') ? import('../roms/JMON') :
            import('../roms/MON-1');
        p.then((result) =>
            this.worker.postMessage({ type: 'UPDATE_MEMORY', value: result.ROM })
        );
    },

    handleUpload(event: any) {
        const files = event.target.files;
        if (files == null || files.length === 0) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () =>
            this.worker.postMessage({ type: 'UPDATE_MEMORY', value: reader.result });
        reader.readAsText(file);
    },

    handleDownload() {
        const pfrom = window.prompt('Start address (hex)', '0800');
        const psize = window.prompt('Size (hex)', '1000');
        if (pfrom != null && psize != null) {
            const from = parseInt(pfrom, 16);
            const size = parseInt(psize, 16);
            this.worker.postMessage({ type: 'READ_MEMORY', from, size });
        }
    },

    postSpeed(speed: string) {
        this.worker.postMessage({ type: 'SET_SPEED', value: speed });
    },

    render({ digits, segments, display, shiftLocked }:AppRootProps) {
        return html`
<style>
    #tec1 {
        width: 600px;
        height: 375px;
        background-image: url(${tec1Image});
        background-size: 100% 100%;
        position: relative;
    }
</style>
<div style="display:inline-block">
    <div style="display:flex; justify-content:space-between; align-items: center; margin: 3px">
        <div>
            <label for="file-upload">HEX</label>
            <input id="file-upload" type="file" accept=".hex" @change=${(event: any) => this.handleUpload(event)}>
        </div>
        <button @click=${() => this.handleDownload()}>Download</button>
    </div>
    <div id="tec1">
        ${  this.classic ?
            html`<div is="keypad-classic" @button=${(event: any) => this.handleButton(event)}></div>` :
            html`<div is="keypad-modern" @button=${(event: any) => this.handleButton(event)}></div>`
        }
        <div
            is="key-button"
            .code=${'Escape'}
            .text=${'R'}
            .color=${'#cd3d45'}
            .left=${349}
            .top=${301}
            @button=${(event: any) => this.handleButton(event)}>
        </div>

        <div
            is="key-button"
            .code=${'ShiftLock'}
            .text=${'SH'}
            .color=${ shiftLocked ? '#d8696f' : '#cd3d45'}
            .left=${386}
            .top=${333}
            @button=${(event: any) => this.handleButton(event)}>
        </div>

        <div id="digit-pane">
            <div id="seven" is="seven-seg-display" .digits=${digits} .segments=${segments} .display=${display}></div>
        </div>
    </div>
    <div style="display:flex; justify-content:space-between; align-items: center; margin: 3px">
        <div>
            <label for="rom-select">ROM</label>
            <select id="rom-select" @change=${(event: any) => this.handleChangeROM(event.target.value)}>
                <option>MON-1</option>
                <option>MON-1A</option>
                <option>MON-1B</option>
                <option>MON-2</option>
                <option>JMON</option>
            </select>
        </div>
        <div>
            <input
                id="key-layout"
                type="checkbox"
                ?checked=${this.classic}
                @change=${(event: any) => {
                    this.classic = event.target.checked;
                    localStorage.setItem('classic', String(this.classic))
                }}
                >
            <label for="key-layout">original key layout</label>
        </div>
        <div>
            <label for="speed">Speed</label>
            Speed
            <input
            id="speed"
                type="range"
                min="0"
                max="99"
                value=${this.speed || "50"}
                @change=${(event: any) => {
                    this.speed = event.target.value;
                    localStorage.setItem('speed', String(this.speed))
                    this.worker.postMessage({ type: 'SET_SPEED', value: this.speed });
                    this.postSpeed(this.speed);
                }}
                >
        </div>
    </div>
    <p>MON 1 Restart:</p>
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
`;
    },
});
