/**
 * @param {import ('svelte').SvelteComponentTyped} component
 * @param {string[]} events
 * @param {Function} handler
 */
export const delegatedEventsHandler = (component, events, handler) => {
  if (!component || component.$$.callbacks._de_) return;
  component.$$.callbacks = new Proxy(component.$$.callbacks, {
    get: (target, prop) => {
      if (events.includes("*") || events.includes(String(prop))) {
        if (!(prop in target)) target[prop] = [handler];
        else if (!target[prop].includes(handler)) target[prop].push(handler);
      }
      return target[prop];
    },
  });
  Object.defineProperty(component.$$.callbacks, "_de_", {
    configurable: false,
    enumerable: false,
    value: true,
  });
};
