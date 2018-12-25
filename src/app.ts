import * as we from 'wicked-elements';
const {default: wickedElements} = we;

import { wickedTec1 } from './components/wicked-tec1';
import { sevenSegDisplay } from './components/seven-seg-display';
import { sevenSeg } from './components/seven-seg';
import { instructions } from './components/instructions';
import { keyButton } from './components/key-button';
import { keyPadClassic } from './components/keypad-classic';
import { keyPadModern } from './components/keypad-modern';

export function initApp() {
    wickedElements.define('[is="wicked-tec1"]', wickedTec1);
    wickedElements.define('[is="seven-seg-display"]', sevenSegDisplay);
    wickedElements.define('[is="seven-seg"]', sevenSeg);
    wickedElements.define('[is="instructions"]', instructions);
    wickedElements.define('[is="key-button"]', keyButton);
    wickedElements.define('[is="keypad-classic"]', keyPadClassic);
    wickedElements.define('[is="keypad-modern"]', keyPadModern);
}
