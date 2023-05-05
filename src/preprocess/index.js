import { walk, parse } from "svelte/compiler";
import * as MagicString from "magic-string";
import { findDelegatedEvent } from "./utils.js";
import { addImport } from "./import.js";
import buildRegisterDelegatedEvents from "./builder/buildRegisterDelegatedEvents.js";

/**
 * @param {{componentName: string, varName: string, events: string[], handler: string, isOnce: string}} props
 * @returns {string}
 */
const buildComponentHandler = (props) => {
  const { componentName, varName, events, handler, isOnce } = props;
  return `
  /** @type {typeof ${componentName}} */
  let ${varName};
  $: delegatedEventsHandler(${varName}, [${events
    .map((e) => `'${e}'`)
    .join(", ")}], ${isOnce ? `once(${handler})` : handler});
`;
};

/**
 * @param {ReturnType<import('svelte/compiler').parse>} parsed
 * @returns {Set<string>}
 */
const collectUsedVars = (parsed) => {
  /** @type {Set<string>} */
  const usedVarNames = new Set();
  walk(/** @type {any} */ (parsed.instance), {
    enter(node) {
      if (node.type === "Identifier") {
        usedVarNames.add(node.name);
      }
    },
  });
  return usedVarNames;
};

/**
 * @param {Set<string>} usedVarNames
 * @param {string} name
 * @returns {string}
 */
const getUniqueVarName = (usedVarNames, name) => {
  let i = 0;
  while (usedVarNames.has(`${name}${i}`)) {
    i++;
  }
  usedVarNames.add(`${name}${i}`);
  return `${name}${i}`;
};

/**
 *
 * @param {Config} config
 */
const preprocess = (config = {}) => {
  /**
   * @satisfies {Parameters<import ('svelte/compiler')['preprocess']>[1]}
   */
  const preprocessor = {
    markup: ({ content, filename }) => {
      /** @type {AddedImports} */
      const addedImports = {};
      /** @type {string | undefined} */
      let currentComponentName;

      let parsed = parse(content);
      if (!parsed.instance) {
        content = `${content}\n<script></script>`;
        parsed = parse(content);
      }

      const magicContent = new MagicString.default(content);
      const html = parsed.html;
      const instance = /** @type {NonNullable<(typeof parsed)["instance"]>} */ (
        parsed.instance
      );

      const usedVarNames = collectUsedVars(parsed);

      walk(/** @type {any} */ (html), {
        // @ts-ignore
        enter(/** @type {typeof html} */ node) {
          if (node.type === "Element") {
            const attribute = findDelegatedEvent(node);
            if (!attribute) return;
            const varName = getUniqueVarName(usedVarNames, node.name);
            const componentName = getUniqueVarName(usedVarNames, "component");
            const modifiers = attribute.modifiers;
            magicContent.update(
              attribute.start,
              attribute.end,
              `bind:this={${varName}}`
            );

            const needGetCurrentComponent = !currentComponentName;
            if (!currentComponentName) {
              currentComponentName = getUniqueVarName(
                usedVarNames,
                "component"
              );
            }
            const handlerStatement = buildRegisterDelegatedEvents(
              varName,
              currentComponentName,
              needGetCurrentComponent,
              modifiers,
              (from, name) => {
                addImport(
                  { from, name, content, parsed, magicContent },
                  addedImports
                );
              }
            );

            addImport(
              {
                from: "svelte-preprocess-delegate-events/runtime",
                name: "registerDelegatedEvents",
                content,
                parsed,
                magicContent,
              },
              addedImports
            );

            addImport(
              {
                from: "svelte/internal",
                name: "get_current_component",
                content,
                parsed,
                magicContent,
              },
              addedImports
            );

            magicContent.appendLeft(instance.end - 9, handlerStatement);
          } else if (node.type === "InlineComponent") {
            for (const attribute of node.attributes) {
              if (attribute.type === "EventHandler") {
                const { name } = attribute;
                const isOnce = attribute.modifiers.includes("once");
                if (attribute.modifiers.length !== (isOnce ? 1 : 0)) {
                  throw new Error(
                    `Event modifiers other than 'once' can only be used on DOM elements (${attribute.start}:${attribute.end})`
                  );
                }
                const { expression } = attribute;
                const handler = expression
                  ? content.substring(expression.start, expression.end)
                  : undefined;

                if (handler) {
                  addImport(
                    {
                      from: "svelte-preprocess-delegate-events/runtime",
                      name: "delegatedEventsHandler",
                      content,
                      parsed,
                      magicContent,
                    },
                    addedImports
                  );
                  if (isOnce) {
                    addImport(
                      {
                        from: "svelte/internal",
                        name: "once",
                        content,
                        parsed,
                        magicContent,
                      },
                      addedImports
                    );
                  }
                  const varName = getUniqueVarName(usedVarNames, node.name);
                  magicContent.update(
                    attribute.start,
                    attribute.end,
                    `bind:this={${varName}}`
                  );
                  const handlerStatement = buildComponentHandler({
                    componentName: node.name,
                    varName,
                    events: name.split(","),
                    handler,
                    isOnce,
                  });
                  if (instance) {
                    magicContent.appendLeft(instance.end - 9, handlerStatement);
                  } else {
                    magicContent.appendLeft(
                      0,
                      `<script>\n${handlerStatement}\n</script>`
                    );
                  }
                } else {
                }
              }
            }
          }
        },
      });

      return {
        code: magicContent.toString(),
        map: magicContent.generateMap({ source: filename ?? "" }).toString(),
      };
    },
  };

  return preprocessor;
};

export default preprocess;
