import { walk } from 'svelte/compiler';
import * as MagicString from 'magic-string';
import { addImport } from './import.js';
import buildElementRuntime from './builder/element.js';
import buildComponentRuntime from './builder/component.js';
import { getBindThisVarName } from './bindthis.js';
import { parse } from 'svelte-parse-markup';

/**
 * @param {ReturnType<import('svelte/compiler').parse>} parsed
 * @returns {Set<string>}
 */
const collectUsedVars = (parsed) => {
  /** @type {Set<string>} */
  const usedVarNames = new Set();
  walk(/** @type {any} */ (parsed.instance), {
    enter(node) {
      if (node.type === 'Identifier') {
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
  // Remove chars that can not use for variable name.
  const normalized = name.replace(/[^a-zA-Z_$]|^(\d)/g, '_');
  let i = 0;
  while (usedVarNames.has(`${normalized}${i}`)) {
    i++;
  }
  usedVarNames.add(`${normalized}${i}`);
  return `${normalized}${i}`;
};

/**
 * @param {ReturnType<typeof import('svelte/compiler')['parse']>['html']} node
 */
const findDelegatedEvent = (node) => {
  for (const attribute of node.attributes) {
    if (attribute.type === 'EventHandler' && attribute.name === '*') {
      const { expression } = attribute;
      if (expression) {
        throw Error(
          `Event handler with \`on:*\` is not supported. (${expression.start}:${expression.end})`,
        );
      }

      return attribute;
    }
  }
  return undefined;
};

const preprocess = () => {
  /**
   * @satisfies {Parameters<import ('svelte/compiler')['preprocess']>[1]}
   */
  const preprocessor = {
    markup: ({ content, filename }) => {
      /** @type {Record<string, string[]>} */
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
          if (node.type === 'Element') {
            const attribute = findDelegatedEvent(node);
            if (!attribute) return;
            const bindThis = node.attributes.find(
              (/** @type {any} */ a) => a.name === 'this',
            );
            const varName = bindThis
              ? getBindThisVarName(bindThis.expression)
              : getUniqueVarName(usedVarNames, node.name);
            const modifiers = attribute.modifiers;
            if (!bindThis) {
              magicContent.update(
                attribute.start,
                attribute.end,
                `bind:this={${varName}.bounds}`,
              );
            } else {
              magicContent.update(attribute.start, attribute.end, '');
            }

            const needGetCurrentComponent = !currentComponentName;
            if (!currentComponentName) {
              currentComponentName = getUniqueVarName(
                usedVarNames,
                'component',
              );
            }
            const handlerStatement = buildElementRuntime(
              bindThis,
              varName,
              currentComponentName,
              needGetCurrentComponent,
              modifiers,
              (from, name) => {
                addImport(
                  { from, name, content, parsed, magicContent },
                  addedImports,
                );
              },
            );

            addImport(
              {
                from: 'svelte-preprocess-delegate-events/runtime',
                name: 'registerDelegatedEvents',
                content,
                parsed,
                magicContent,
              },
              addedImports,
            );

            addImport(
              {
                from: 'svelte/internal',
                name: 'get_current_component',
                content,
                parsed,
                magicContent,
              },
              addedImports,
            );

            magicContent.appendLeft(instance.end - 9, handlerStatement);
            return;
          }

          if (node.type === 'InlineComponent') {
            const attribute = findDelegatedEvent(node);
            if (!attribute) return;
            const isOnce = attribute.modifiers.includes('once');
            if (attribute.modifiers.length !== (isOnce ? 1 : 0)) {
              throw new Error(
                `Event modifiers other than 'once' can only be used on DOM elements (${attribute.start}:${attribute.end})`,
              );
            }

            const needGetCurrentComponent = !currentComponentName;
            if (!currentComponentName) {
              currentComponentName = getUniqueVarName(
                usedVarNames,
                'component',
              );
            }

            const bindThis = node.attributes.find(
              (/** @type {any} */ a) => a.name === 'this',
            );
            const varName = bindThis
              ? getBindThisVarName(bindThis.expression)
              : getUniqueVarName(usedVarNames, node.name);

            if (!bindThis) {
              magicContent.update(
                attribute.start,
                attribute.end,
                `bind:this={${varName}.bounds}`,
              );
            } else {
              magicContent.update(attribute.start, attribute.end, '');
            }

            const proxyCallbacks = buildComponentRuntime(
              bindThis,
              currentComponentName,
              varName,
              needGetCurrentComponent,
              isOnce,
              (from, name) => {
                addImport(
                  { from, name, content, parsed, magicContent },
                  addedImports,
                );
              },
            );
            magicContent.appendLeft(instance.end - 9, proxyCallbacks);
          }
        },
      });

      return {
        code: magicContent.toString(),
        map: magicContent.generateMap({ source: filename ?? '' }).toString(),
      };
    },
  };

  return preprocessor;
};

export default preprocess;
