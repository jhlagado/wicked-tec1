import { Tec1App } from './components/app-root';
import { sevenSegDisplay } from './components/seven-seg-display';
import { sevenSeg } from './components/seven-seg';
import { keyButton } from './components/key-button';
import { keyPadClassic } from './components/keypad-classic';
import { keyPadModern } from './components/keypad-modern';

import * as we  from 'wicked-elements';
const wickedElements = (we as any).default;

export function initApp() {
    wickedElements.define('[is="app-root"]', Tec1App);
    wickedElements.define('[is="seven-seg-display"]', sevenSegDisplay);
    wickedElements.define('[is="seven-seg"]', sevenSeg);
    wickedElements.define('[is="key-button"]', keyButton);
    wickedElements.define('[is="keypad-classic"]', keyPadClassic);
    wickedElements.define('[is="keypad-modern"]', keyPadModern);
}
