import { get_listen_params } from "../listen.js";

/**
 * @param {string} varName
 * @param {string} currentComponentName
 * @param {boolean} needGetCurrentComponent
 * @param {string[]} modifiers
 * @param {(from: string, name: string) => void} addImport
 * @returns {string}
 */
const build = (
  varName,
  currentComponentName,
  needGetCurrentComponent,
  modifiers,
  addImport
) => {
  const { add_modifiers, option } = get_listen_params(modifiers, addImport);
  const optionStr = JSON.stringify(option);
  const get_current_component = needGetCurrentComponent
    ? `\n  const ${currentComponentName} = get_current_component();`
    : "";
  return `
  /** @type {Element} */
  let ${varName};${get_current_component}
  $: registerDelegatedEvents(${varName}, ${currentComponentName}, ${add_modifiers}, ${optionStr});
`;
};

export default build;
