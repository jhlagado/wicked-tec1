import wickedElements from 'wicked-elements';
import hyperHTML from 'hyperhtml';
import { observeProperties, debounceRender } from './util/observe';

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

    wickedElements.define('[is="wicked-element"]', {

        init: function (event) {
            this.el = event.currentTarget;
            this.el.attachShadow({ mode: 'open' });
            observeProperties(this, this.el);

            this._digits = 0;
            this._segments = 0;
            this._rando = 0;

            this.requestRender = debounceRender(this);
            this.handleKeyDown = (event) => this.onkeydown(event);
        },

        onconnected(event) {
            console.log('on connected');
            this.worker = new Worker('./worker/worker.js');
            this.worker.onmessage = event => {
                let view = new Int8Array(event.data.buffer);
                this._digits = view[1];
                this._segments = view[2];
                this._rando = view[3];
                this.requestRender();
            }
            this.worker.postMessage({ type: 'INIT' });
            document.addEventListener("keydown", this.handleKeyDown.bind(this));
        },

        ondisconnected(event) {
            console.log('on disconnected');
            this.worker.terminate();
            document.removeEventListener("keydown", this.handleKeyDown.bind(this));
        },

        onattributechanged(event) {
            console.log('on attr changed');
        },

        onclick(event) {
            console.log('ON CLICK!!');
            this.el.x++;
        },

        onkeydown(event) {

            if (event.code === 'Escape') {
                this.worker.postMessage({ type: 'INIT' });
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
                this.worker.postMessage({ type: 'SET_INPUT_VALUE', port: 0, value: keyCode});
                this.worker.postMessage({ type: 'NMI'});
                event.preventDefault();
            }
            else {
                console.log(event, event.code, event.key);
            }
        },

        render() {
            this.html`!
<slot></slot>!
<p>digits ${this._digits}</p>
<p>segments ${this._segments}</p>
<p>I am rando ${this._rando}</p>`;
        },

        get html() {
            return hyperHTML.bind(this.el.shadowRoot);
        },

        get observedProperties() {
            return ['x', 'y'];
        },

        propertyChanged(prop, newValue, oldValue) {
            console.log(`property changed ${prop} ${newValue} ${oldValue} `);
            this.render();
        }
    });

    const elem = document.getElementById('wicked');
    elem.x = 20;
    elem.y = [...[1, 2, 3]];

}
