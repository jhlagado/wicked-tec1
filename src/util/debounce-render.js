import {html, render} from 'lit-html';

export function debounceRender(object) {
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
