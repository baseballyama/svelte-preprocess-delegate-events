import { get_listen_params } from '../listen.js';

/**
 * @param {boolean} hasBindThis
 * @param {string} varName
 * @param {string} currentComponentName
 * @param {boolean} needGetCurrentComponent
 * @param {string[]} modifiers
 * @param {(from: string, name: string) => void} addImport
 * @returns {string}
 */
const build = (
  hasBindThis,
  varName,
  currentComponentName,
  needGetCurrentComponent,
  modifiers,
  addImport
) => {
  if (!hasBindThis)
    addImport('svelte-preprocess-delegate-events/runtime', 'boundElements');
  const { add_modifiers, option } = get_listen_params(modifiers, addImport);
  const optionStr = JSON.stringify(option);
  const get_current_component = needGetCurrentComponent
    ? `\n  const ${currentComponentName} = get_current_component();`
    : '';
  if (hasBindThis) {
    return `\
  ${get_current_component}
  $: registerDelegatedEvents(${varName}, ${currentComponentName}, ${add_modifiers}, ${optionStr});
  `;
  } else {
    return `
  const ${varName} = boundElements();${get_current_component}
  $: registerDelegatedEvents(${varName}.bounds, ${currentComponentName}, ${add_modifiers}, ${optionStr});
`;
  }
};

export default build;
