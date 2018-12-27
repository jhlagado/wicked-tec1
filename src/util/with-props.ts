import { debounceRender } from './debounce-render';
import { BaseComponent } from './types';

export function withProps(def:any) {

  const def2 = Object.create(def);
  const oldInit = def2.init;
  def2.init = function (event: { currentTarget: any; }) {

    this.element = event.currentTarget;
    this.requestRender = debounceRender(this);

    if (oldInit) {
      oldInit.call(this, event);
    }
    else {
      this.requestRender();
    }
    observeProperties(this);
  }
  return def2;
};

function observeProperties(object:BaseComponent) {

  const props = object.observedProperties;
  if (!props || !props.length) {
    object.requestRender();
    return;
  };

  const element = object.element;
  for (let prop of props) {

    // if the component already has a property of this
    // name then save it for later
    const hasProp = element.hasOwnProperty(prop)
    let initValue;
    if (hasProp) {
      initValue = element[prop];
      delete element[prop];
    }

    // define getters and setters for this property name
    Object.defineProperty(element, prop, {

      get() {
        return object[prop]
      },

      set(value) {
        const oldValue = object[prop];
        object[prop] = value;
        if (oldValue !== value && object.propertyChanged) {
          object.propertyChanged(
            prop, value, oldValue
          );
        }
        object.requestRender();
      }
    });

    // if we saved an old property value earlier
    // reassign it to the component

    if (hasProp) {
      element[prop] = initValue;
    }
  }
}
