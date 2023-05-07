import { walk } from 'svelte/compiler';

/**
 * bind:this="{button}" -> button
 * bind:this="{button[index]}" -> button
 * bind:this="{button.foo}" -> button.foo
 * bind:this="{button.foo[index]}" -> button.foo
 * bind:this="{button[index].button}" -> throw Error
 * @param {import ('estree').Expression} expression
 */
export const getBindThisVarName = (expression) => {
  let hasArray = false;
  let varName = '';
  walk(expression, {
    enter(node, parent, key) {
      if (node.type === 'Identifier') {
        if (hasArray) {
          throw new Error(
            `Can only bind to an identifier (e.g. \`foo\`) or an array (e.g. \`foo[index]\`). (${expression.loc?.start.line}:${expression.loc?.start.column})`
          );
        }
        const isArray =
          parent?.type === 'MemberExpression' &&
          key === 'property' &&
          parent.computed;
        if (!isArray) {
          if (varName) varName = `${varName}.${node.name}`;
          else varName = node.name;
        } else {
          hasArray = true;
        }
      }
    },
  });
  return varName;
};
