let [hidden, visibilityChange] = (typeof document.msHidden !== 'undefined') ?
  ['msHidden', 'msvisibilitychange'] : (typeof document.webkitHidden !== 'undefined') ?
    ['webkitHidden', 'webkitvisibilitychange'] : ['hidden', 'visibilitychange'];

export function isHidden() {
  return document[hidden];
}

export function addVisibilityListener(func) {
  document.addEventListener(visibilityChange, func, false);
}

export function removeVisiblityListener(func) {
  document.removeEventListener(visibilityChange, func, false);
}
