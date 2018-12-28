import { html } from 'lit-html'
import { withProps } from '../util';
export const keyPadClassic = withProps({

    handleButton(buttonEvent: any) {
        const event = new CustomEvent('button', {
            detail: buttonEvent.detail,
        });
        this.element.dispatchEvent(event);
    },

    render() {
        return html`
<div is="key-button" .code=${'Tab'} .text=${'AD'} .color=${'#cd3d45'} .left=${438} .top=${239} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit3'} .text=${'3'} .color=${'#efedeb'} .left=${468} .top=${239} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit7'} .text=${'7'} .color=${'#efedeb'} .left=${500} .top=${239} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'KeyB'} .text=${'B'} .color=${'#efedeb'} .left=${531} .top=${239} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'KeyF'} .text=${'F'} .color=${'#efedeb'} .left=${562} .top=${239} @button=${(event: any) =>
    this.handleButton(event)}></div>

<div is="key-button" .code=${'Enter'} .text=${'GO'} .color=${'#cd3d45'} .left=${438} .top=${270} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit2'} .text=${'2'} .color=${'#efedeb'} .left=${468} .top=${270} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit6'} .text=${'6'} .color=${'#efedeb'} .left=${500} .top=${270} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'KeyA'} .text=${'A'} .color=${'#efedeb'} .left=${531} .top=${270} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'KeyE'} .text=${'E'} .color=${'#efedeb'} .left=${562} .top=${270} @button=${(event: any) =>
    this.handleButton(event)}></div>

<div is="key-button" .code=${'ArrowDown'} .text=${'-'} .color=${'#cd3d45'} .left=${438} .top=${301} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit1'} .text=${'1'} .color=${'#efedeb'} .left=${468} .top=${301} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit5'} .text=${'5'} .color=${'#efedeb'} .left=${500} .top=${301} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit9'} .text=${'9'} .color=${'#efedeb'} .left=${531} .top=${301} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'KeyD'} .text=${'D'} .color=${'#efedeb'} .left=${562} .top=${301} @button=${(event: any) =>
    this.handleButton(event)}></div>

<div is="key-button" .code=${'ArrowUp'} .text=${'+'} .color=${'#cd3d45'} .left=${438} .top=${331} @button=${(event:
    any) => this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit0'} .text=${'0'} .color=${'#efedeb'} .left=${468} .top=${331} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit4'} .text=${'4'} .color=${'#efedeb'} .left=${500} .top=${332} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'Digit8'} .text=${'8'} .color=${'#efedeb'} .left=${531} .top=${332} @button=${(event: any) =>
    this.handleButton(event)}></div>
<div is="key-button" .code=${'KeyC'} .text=${'C'} .color=${'#efedeb'} .left=${562} .top=${332} @button=${(event: any) =>
    this.handleButton(event)}></div>
        `;
    },
});
