import { get_current_component, listen } from "svelte/internal";

/**
 * @param {HTMLElement & { _delegated?: boolean }} element
 * @param {import ('svelte').SvelteComponentTyped} component
 * @param {(event: Parameters<typeof listen>[2]) => Parameters<typeof listen>[2] } add_modifiers
 * @param {Parameters<typeof listen>[3]} option
 */
export const registerDelegatedEvents = (
  element,
  component,
  add_modifiers = (handler) => handler,
  option = {}
) => {
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
};

// ---------------------------------------------------------------
// 古い
// ---------------------------------------------------------------

/**
 * @param {import ('svelte').SvelteComponentTyped} component
 * @param {string[]} events
 * @param {Function} handler
 * @param {boolean} bubbles
 */
export const delegatedEventsHandler = (
  component,
  events,
  handler,
  bubbles = false
) => {
  if (!component || component.$$.callbacks._de_) return;
  component.$$.callbacks = new Proxy(component.$$.callbacks, {
    get: (target, prop) => {
      if (events.includes("*") || events.includes(String(prop))) {
        if (!(prop in target)) target[prop] = [handler];
        else if (!target[prop].includes(handler)) target[prop].push(handler);
      }
      target[prop].forEach((/** @type {any} */ h) => (h.bubbles = bubbles));
      return target[prop];
    },
  });
  Object.defineProperty(component.$$.callbacks, "_de_", {
    configurable: false,
    enumerable: false,
    value: true,
  });
};

/**
 * @returns
 */
export const createElementForwarder = () => {
  /** @type {(() => void)[] | undefined} */
  let dispose = undefined;
  /**
   * @param {HTMLElement} element
   * @param {(nakid: Parameters<typeof listen>[2]) => Parameters<typeof listen>[2]} addModifiers
   * @param {Parameters<typeof listen>[3]} option
   */
  return (element, addModifiers = (nakid) => nakid, option = {}) => {
    if (element) {
      const component = get_current_component();
      const { delegated_events } = component.$$;
      if (delegated_events) {
        dispose = Object.keys(delegated_events).map((key) => {
          const nakid = (/** @type {Event} */ e) => delegated_events[key](e);
          const handler = addModifiers(nakid);
          return listen(element, key, handler, option);
        });
      }
    } else if (dispose) {
      dispose.forEach((d) => d());
      dispose = undefined;
    }
  };
};

/**
 * @param {import ('svelte').SvelteComponentTyped & { $$: {delegated_events: Record<string, Function[]> }}} component
 * @param {Record<string, Function[]>} eventAndHandlers
 */
export const register_delegated_events = (component, eventAndHandlers) => {
  if (component && !component.$$.delegated_events) {
    component.$$.delegated_events = eventAndHandlers;
  }
};
