import { walk, parse } from "svelte/compiler";
import * as MagicString from "magic-string";
import knownevents from "./knownevents.js";

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
 * @param {any} attribute
 * @returns {string}
 */
const getModifiersAsString = (attribute) => {
  return attribute.modifiers.map((/** @type {string} */ m) => `|${m}`).join("");
};

/**
 * NODE: This function doesn't check if already imported.
 * @param {string} content
 * @param {ReturnType<import('svelte/compiler').parse>} parsed
 * @param {import ('magic-string').default} magicContent
 * @param {string} importStatement
 */
const addImport = (content, parsed, magicContent, importStatement) => {
  if (content.includes(importStatement)) return;
  const { instance } = parsed;
  const { start, end } = instance ?? { start: undefined, end: undefined };
  let endOfScriptStart = 0;
  if (start !== undefined) {
    const script = content.substring(start, end);
    endOfScriptStart = script.indexOf(">") + 1;
  }
  magicContent.appendLeft(endOfScriptStart, `\n  ${importStatement}`);
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
      const parsed = parse(content);
      const magicContent = new MagicString.default(content);

      const usedVarNames = collectUsedVars(parsed);
      let isImportedRuntime = false;
      let isImportedOnce = false;

      walk(/** @type {any} */ (parsed.html), {
        // @ts-ignore
        enter(/** @type {typeof parsed.html} */ node) {
          if (node.type === "Element") {
            for (const attribute of node.attributes) {
              if (attribute.type === "EventHandler") {
                const { name } = attribute;
                const modifiers = getModifiersAsString(attribute);
                const { expression } = attribute;
                const handler = expression
                  ? content.substring(expression.start, expression.end)
                  : "";

                /**
                 * @param {string[]} events
                 * @param {string} handler
                 * @returns {string}
                 */
                const eventsToSvelte = (events, handler) => {
                  return events
                    .map((e) => {
                      if (handler) {
                        return `on:${e}${modifiers}={${handler}}`;
                      } else {
                        return `on:${e}${modifiers}`;
                      }
                    })
                    .join(" ");
                };
                if (name === "*") {
                  const replaced = eventsToSvelte(knownevents, handler);
                  magicContent.update(attribute.start, attribute.end, replaced);
                } else if (typeof name === "string" && name.includes(",")) {
                  const replaced = eventsToSvelte(name.split(","), handler);
                  magicContent.update(attribute.start, attribute.end, replaced);
                }
              }
            }
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
                const handler = content.substring(
                  expression.start,
                  expression.end
                );
                if (!isImportedRuntime) {
                  addImport(
                    content,
                    parsed,
                    magicContent,
                    'import { delegatedEventsHandler } from "svelte-preprocess-delegate-events/runtime";'
                  );
                }
                if (isOnce && !isImportedOnce) {
                  addImport(
                    content,
                    parsed,
                    magicContent,
                    'import { once } from "svelte/internal";'
                  );
                  isImportedOnce = true;
                }
                isImportedRuntime = true;
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
                if (parsed.instance) {
                  magicContent.appendLeft(
                    parsed.instance.end - 9,
                    handlerStatement
                  );
                } else {
                  magicContent.appendLeft(
                    0,
                    `<script>\n${handlerStatement}\n</script>`
                  );
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
