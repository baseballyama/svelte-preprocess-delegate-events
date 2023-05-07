import { listen, bubble, once } from 'svelte/internal';

/**
 * @param {(Element & { _delegated?: boolean })[]} elements
 * @param {import ('svelte').SvelteComponentTyped} component
 * @param {(event: Parameters<typeof listen>[2]) => Parameters<typeof listen>[2] } add_modifiers
 * @param {Parameters<typeof listen>[3]} option
 */
export function registerDelegatedEvents(
  elements,
  component,
  add_modifiers = (handler) => handler,
  option = {}
) {
  for (const element of elements) {
    if (element && !element._delegated) {
      element._delegated = true;
      for (const type of Object.keys(component.$$.callbacks)) {
        for (const handler of component.$$.callbacks[type]) {
          // remove event listner when element is destroyed automatically.
          // Therefore don't need to remove event listner manually.
          listen(element, type, add_modifiers(handler), option);
        }
      }
    }
  }
}

export function boundElements() {
  return new Proxy(
    { bounds: /** @type {Element[]} */ ([]) },
    {
      get: (target, prop) => {
        target.bounds = target.bounds.filter((e) => e.parentNode !== null);
        // @ts-ignore
        return target[prop];
      },
      set: (target, prop, value) => {
        if (prop === 'bounds') {
          if (value && !target.bounds.includes(value)) {
            target.bounds.push(value);
          }
        } else {
          // @ts-ignore
          target[prop] = value;
        }
        return true;
      }
    }
  );
}

export function boundComponents() {
  return new Proxy(
    { bounds: /** @type {import ('svelte').SvelteComponentTyped[]} */ ([]) },
    {
      get: (target, prop) => {
        // This is super hackey.
        target.bounds = target.bounds.filter((c) => c.$$.on_destroy);
        // @ts-ignore
        return target[prop];
      },
      set: (target, prop, value) => {
        if (prop === 'bounds') {
          if (value && !target.bounds.includes(value)) {
            target.bounds.push(value);
          }
        } else {
          // @ts-ignore
          target[prop] = value;
        }
        return true;
      }
    }
  );
}

/**
 * @param {import ('svelte').SvelteComponentTyped} thisComponent
 * @param {import ('svelte').SvelteComponentTyped[]} boundComponents
 * @param {boolean} isOnce
 */
export function proxyCallbacks(thisComponent, boundComponents, isOnce) {
  for (const boundComponent of boundComponents) {
    if (boundComponent && !boundComponent.$$.callbacks._de_) {
      boundComponent.$$.callbacks = new Proxy(boundComponent.$$.callbacks, {
        get: (target, prop) => {
          if (!target._de_.includes(prop)) {
            target._de_.push(prop);
            boundComponent.$on(/** @type {string} */ (prop), (e) =>
              // @ts-ignore
              bubble.call(this, thisComponent, isOnce ? once(e) : e)
            );
          }
          return target[prop];
        }
      });
      Object.defineProperty(boundComponent.$$.callbacks, '_de_', {
        configurable: false,
        enumerable: false,
        value: []
      });
    }
  }
}
