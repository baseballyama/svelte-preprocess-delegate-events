import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import preprocess from '../src/preprocess/index.js';

describe.concurrent('test', () => {
  const cases = readdirSync('./test/fixture');
  for (const testCase of cases) {
    it(testCase, () => {
      const expectedPath = `./test/fixture/${testCase}/output.svelte`;
      const expectedErrorPath = `./test/fixture/${testCase}/error.txt`;

      const input = readFileSync(
        `./test/fixture/${testCase}/input.svelte`,
        'utf-8'
      );

      const expected = existsSync(expectedPath)
        ? readFileSync(expectedPath, 'utf-8')
        : undefined;

      const expectedError = existsSync(expectedErrorPath)
        ? readFileSync(expectedErrorPath, 'utf-8')
        : undefined;

      let error = '';
      try {
        const actual = preprocess().markup({
          content: input,
          filename: 'input.svelte',
        });
        expect(expected).toBeTruthy();
        writeFileSync(`./test/fixture/${testCase}/actual.svelte`, actual.code);
        expect(actual.code).toBe(expected);
      } catch (/** @type {any} */ e) {
        error = e.message;
        if (!expectedError) {
          console.error(e);
        }
        expect(expectedError).toBeTruthy();
        expect(error).toBe(expectedError);
      }
    });
  }
});
