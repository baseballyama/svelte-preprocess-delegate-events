import { walk } from 'svelte/compiler';

/**
 * @param {AddImportProp["parsed"]["instance"]} instance
 * @param {string} from
 * @param {string} name
 */
const hasImport = (instance, from, name) => {
  /** @type {import('estree').ImportDeclaration | undefined} */
  let importDeclaration;
  let hasImportSpecifier = false;

  walk(/** @type {any} */ (instance), {
    enter(node) {
      if (importDeclaration) return;
      if (node.type !== 'ImportDeclaration') return;
      if (
        node.source.value === from &&
        node.specifiers.find((s) => s.type === 'ImportSpecifier')
      ) {
        importDeclaration = node;
        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.name === name
          ) {
            hasImportSpecifier = true;
            break;
          }
        }
      }
    }
  });
  return { importDeclaration, hasImportSpecifier };
};

/**
 * @param {AddImportProp} props
 * @param {Record<string, string[]>} addedImports
 */
export const addImport = (props, addedImports) => {
  const { from, name, content, parsed, magicContent } = props;
  if (addedImports[from] && addedImports[from]?.indexOf(name) !== -1) return;
  if (addedImports[from]) addedImports[from]?.push(name);
  else addedImports[from] = [name];
  const { instance } = parsed;
  if (!instance) {
    throw Error(
      'This is probably a bug. Please submit a issue on https://github.com/baseballyama/svelte-preprocess-delegate-events/issues'
    );
  }

  const { start, end } = instance;
  const endOfScriptStart =
    start + content.substring(start, end).indexOf('>') + 1;

  const { importDeclaration, hasImportSpecifier } = hasImport(
    instance,
    from,
    name
  );

  if (hasImportSpecifier) return;

  if (importDeclaration) {
    const lastSpecifier =
      importDeclaration.specifiers[importDeclaration.specifiers.length - 1];
    magicContent.appendLeft(
      /** @type {any} */ (lastSpecifier)?.end ?? 0,
      `, ${name}`
    );
    return;
  }

  magicContent.appendLeft(
    endOfScriptStart,
    `\n  import { ${name} } from '${from}';`
  );
};
