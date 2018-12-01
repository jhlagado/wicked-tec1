import wickedElements from 'wicked-elements';
import hyperHTML from 'hyperhtml';
import { observeProperties } from './util/observe';

export function initApp() {

    wickedElements.define('[is="wicked-element"]', {

        init: function (event) {
            this.el = event.currentTarget;
            this.el.attachShadow({ mode: 'open' });
            observeProperties(this, this.el);

            this._rando = Math.random();
            this.render();
        },

        onconnected(event) {
            console.log('on connected');
        },

        ondisconnected(event) {
            console.log('on disconnected');
        },

        onattributechanged(event) {
            console.log('on attr changed');
        },

        onclick(event) {
            console.log('ON CLICK!!');
            this.el.x++;
        },

        render() {
            this.html`!
<slot></slot>!
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
    elem.y = [...[1,2,3]];

}
