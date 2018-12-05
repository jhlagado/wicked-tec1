import { html } from 'lit-html'
import { withProps } from '../util';
export const keyPadModern = withProps({

    handleButton(code) {
        const event = new CustomEvent('click', {
            detail: {
                code: code,
            },
        });
        this.element.dispatchEvent(event);
    },

    render() {
        return html`
<div is="key-button" .text=${ 'AD'} .color=${ '#cd3d45'} .left=${438} .top=${239} @click=${() => this.handleButton('Tab')}></div>
<div is="key-button" .text=${ 'C'} .color=${ '#efedeb'} .left=${468} .top=${239} @click=${() => this.handleButton('KeyC')}></div>
<div is="key-button" .text=${ 'D'}  .color=${ '#efedeb'} .left=${500} .top=${239} @click=${() => this.handleButton('KeyD')}></div>
<div is="key-button" .text=${ 'E'} .color=${ '#efedeb'} .left=${531} .top=${239} @click=${() => this.handleButton('KeyE')}></div>
<div is="key-button" .text=${ 'F'} .color=${ '#efedeb'} .left=${562} .top=${239} @click=${() => this.handleButton('KeyF')}></div>

<div is="key-button" .text=${ 'GO'} .color=${ '#cd3d45'} .left=${438} .top=${270} @click=${() => this.handleButton('Enter')}></div>
<div is="key-button" .text=${ '8'} .color=${ '#efedeb'} .left=${468} .top=${270} @click=${() => this.handleButton('Digit8')}></div>
<div is="key-button" .text=${ '9'} .color=${ '#efedeb'} .left=${500} .top=${270} @click=${() => this.handleButton('Digit9')}></div>
<div is="key-button" .text=${ 'A'} .color=${ '#efedeb'} .left=${531} .top=${270} @click=${() => this.handleButton('KeyA')}></div>
<div is="key-button" .text=${ 'B'} .color=${ '#efedeb'} .left=${562} .top=${270} @click=${() => this.handleButton('KeyB')}></div>

<div is="key-button" .text=${ '+'}  .color=${ '#cd3d45'} .left=${438} .top=${301} @click=${() => this.handleButton('ArrowUp')}></div>
<div is="key-button" .text=${ '4'} .color=${ '#efedeb'} .left=${468} .top=${301} @click=${() => this.handleButton('Digit4')}></div>
<div is="key-button" .text=${ '5'} .color=${ '#efedeb'} .left=${500} .top=${301} @click=${() => this.handleButton('Digit5')}></div>
<div is="key-button" .text=${ '6'} .color=${ '#efedeb'} .left=${531} .top=${301} @click=${() => this.handleButton('Digit6')}></div>
<div is="key-button" .text=${ '7'} .color=${ '#efedeb'} .left=${562} .top=${301} @click=${() => this.handleButton('Digit7')}></div>

<div is="key-button" .text=${ '-'}  .color=${ '#cd3d45'} .left=${438} .top=${331} @click=${() => this.handleButton('ArrowDown')}></div>
<div is="key-button" .text=${ '0'} .color=${ '#efedeb'} .left=${468} .top=${331} @click=${() => this.handleButton('Digit0')}></div>
<div is="key-button" .text=${ '1'} .color=${ '#efedeb'} .left=${500} .top=${332} @click=${() => this.handleButton('Digit1')}></div>
<div is="key-button" .text=${ '2'} .color=${ '#efedeb'} .left=${531} .top=${332} @click=${() => this.handleButton('Digit2')}></div>
<div is="key-button" .text=${ '3'} .color=${ '#efedeb'} .left=${562} .top=${332} @click=${() => this.handleButton('Digit3')}></div>
        `;
    },
});
