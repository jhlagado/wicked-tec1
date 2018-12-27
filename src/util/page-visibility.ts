let [hidden, visibilityChange] = (typeof (document as any).msHidden !== 'undefined') ?
  ['msHidden', 'msvisibilitychange'] : (typeof (document as any).webkitHidden !== 'undefined') ?
    ['webkitHidden', 'webkitvisibilitychange'] : ['hidden', 'visibilitychange'];

export function isHidden() {
  return (document as any)[hidden];
}

export function addVisibilityListener(func: EventListenerOrEventListenerObject) {
  document.addEventListener(visibilityChange, func, false);
}

export function removeVisiblityListener(func: EventListenerOrEventListenerObject) {
  document.removeEventListener(visibilityChange, func, false);
}
