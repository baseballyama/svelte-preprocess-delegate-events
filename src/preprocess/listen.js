/**
 * @param {string} modifier
 */
const get_modifier_function = (modifier) => {
  switch (modifier) {
    case 'preventDefault':
      return 'prevent_default';
    case 'stopPropagation':
      return 'stop_propagation';
    case 'stopImmediatePropagation':
      return 'stop_immediate_propagation';
    case 'passive':
      return undefined;
    case 'nonpassive':
      return undefined;
    case 'capture':
      return undefined;
    case 'once':
      return 'once';
    case 'self':
      return 'self';
    case 'trusted':
      return 'trusted';
    default: {
      throw new Error(`Unknown modifier: ${modifier}`);
    }
  }
};

/**
 * @param {string[]} modifiers
 * @param {(from: string, name: string) => void} addImport
 */
export const get_listen_params = (modifiers, addImport) => {
  const functions = [];
  for (const modifier of modifiers) {
    const fn = get_modifier_function(modifier);
    if (fn) {
      addImport('svelte/internal', fn);
      functions.push(fn);
    }
  }
  const option = {};
  if (modifiers.indexOf('passive') !== -1) option.passive = true;
  if (modifiers.indexOf('nonpassive') !== -1) option.passive = false;
  if (modifiers.indexOf('capture') !== -1) option.capture = true;
  const left = functions.map((f) => `${f}(`).join('');
  const right = functions.map(() => ')').join('');
  const add_modifiers = `(handler) => ${left}handler${right}`;
  return {
    add_modifiers,
    option,
  };
};
