/**
 * @param {ReturnType<typeof import('svelte/compiler')['parse']>['html']} node
 */
export const findDelegatedEvent = (node) => {
  for (const attribute of node.attributes) {
    if (attribute.type === "EventHandler" && attribute.name === "*") {
      const { expression } = attribute;
      if (expression) {
        throw Error(
          `Event handler with \`on:*\` is not supported. (${expression.start}:${expression.end})`
        );
      }

      return attribute;
    }
  }
  return undefined;
};
