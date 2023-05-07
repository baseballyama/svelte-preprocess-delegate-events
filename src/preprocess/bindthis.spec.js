import { describe, it, expect } from 'vitest';
import { parse } from 'svelte/compiler';
import { getBindThisVarName } from './bindthis.js';

describe('getBindThisVarName', () => {
  const testCases = [
    {
      title: 'basic',
      code: `<button bind:this={object} />`,
      expected: 'object',
    },
    {
      title: 'array',
      code: `<button bind:this={object[index]} />`,
      expected: 'object',
    },
    {
      title: 'object',
      code: `<button bind:this={object.foo} />`,
      expected: 'object.foo',
    },
    {
      title: 'object and array',
      code: `<button bind:this={object.foo[index]} />`,
      expected: 'object.foo',
    },
    {
      title: 'array',
      code: `<button bind:this={object[index].foo} />`,
      error:
        'Can only bind to an identifier (e.g. `foo`) or an array (e.g. `foo[index]`). (1:19)',
    },
  ];

  for (const testCase of testCases) {
    it(testCase.title, () => {
      const expression = parse(testCase.code).html.children?.[0]?.attributes[0]
        ?.expression;

      try {
        const varName = getBindThisVarName(expression);
        expect(varName).toBe(testCase.expected);
      } catch (/** @type {any} */ e) {
        expect(e.message).toBe(testCase.error);
      }
    });
  }
});
