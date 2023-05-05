/**
 * @param {string} currentComponentName
 * @param {string} boundComponentName
 * @param {boolean} needGetCurrentComponent
 * @param {boolean} isOnce
 * @param {(from: string, name: string) => void} addImport
 * @returns {string}
 */
const build = (
  currentComponentName,
  boundComponentName,
  needGetCurrentComponent,
  isOnce,
  addImport
) => {
  if (needGetCurrentComponent) {
    addImport("svelte/internal", "get_current_component");
  }
  addImport("svelte-preprocess-delegate-events/runtime", "boundComponents");
  addImport("svelte-preprocess-delegate-events/runtime", "proxyCallbacks");
  const get_current_component = needGetCurrentComponent
    ? `\n  const ${currentComponentName} = get_current_component();`
    : "";
  return `
  /** @type {any} */
  let ${boundComponentName} = boundComponents();${get_current_component}
  $: proxyCallbacks(${currentComponentName}, ${boundComponentName}.bounds, ${
    isOnce ? "true" : "false"
  });
  `;
};

export default build;