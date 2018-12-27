import {html, render} from 'lit-html';
import { BaseComponent } from './types';

export function debounceRender(object:BaseComponent) {
  let requested = false;
  const renderFunc = () => {
    requested = false;
    render(object.render(object), object.element);
  };
  return () => {
    if (requested) return;
    requested = true;
    requestAnimationFrame(renderFunc);
  }
}
