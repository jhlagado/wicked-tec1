import wickedElements from 'wicked-elements';

import { wickedTec1 } from './components/wicked-tec1';
import { sevenSegDisplay } from './components/seven-seg-display';
import { sevenSeg } from './components/seven-seg';
import { instructions } from './components/instructions';

export function initApp() {
    wickedElements.define('[is="wicked-tec1"]', wickedTec1);
    wickedElements.define('[is="seven-seg-display"]', sevenSegDisplay);
    wickedElements.define('[is="seven-seg"]', sevenSeg);
    wickedElements.define('[is="instructions"]', instructions);
}
