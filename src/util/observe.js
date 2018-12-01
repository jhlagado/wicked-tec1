export { observeProperties, debounceRender };

function observeProperties(object, element) {

  const props = object.observedProperties;
  for (let prop of props) {

    const hasProp = element.hasOwnProperty(prop)
    let initValue;
    if (hasProp) {
      initValue = element[prop];
      delete element[prop];
    }

    const key = `_${prop}`;
    Object.defineProperty(element, prop, {

      get() {
        return element[key]
      },

      set(value) {
        const oldValue = element[key];
        element[key] = value;
        if (oldValue !== value) {
          object.propertyChanged(
            prop, value, oldValue
          );
        }
      }
    });

    if (hasProp) {
      element[prop] = initValue;
    }

  }
}

function debounceRender(element) {
  let requested = false;
  const renderFunc = () => {
    requested = false;
    element.render()
  };
  return () => {
    if (requested) return;
    requested = true;
    requestAnimationFrame(renderFunc);
  }
}
