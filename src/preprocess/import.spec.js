import { describe, it, expect } from 'vitest';
import { parse } from 'svelte/compiler';
import * as MagicString from 'magic-string';
import { addImport } from './import.js';

describe('addImport', () => {
  const testCases = [
    {
      title: 'basic',
      code: `<script></script>`,
      expected: `<script>\n  import { get_current_component } from 'svelte/internal';</script>`,
    },
    {
      title: 'basic2',
      code: `<button>Click</button><script></script>`,
      expected: `<button>Click</button><script>\n  import { get_current_component } from 'svelte/internal';</script>`,
    },
    {
      title: 'already imported',
      code: `<script>\nimport { get_current_component } from 'svelte/internal';\n</script>`,
      expected: `<script>\nimport { get_current_component } from 'svelte/internal';\n</script>`,
    },
    {
      title: 'has other import1',
      code: `<script>\nimport { onMount } from "svelte";\n</script>`,
      expected: `<script>\n  import { get_current_component } from 'svelte/internal';\nimport { onMount } from "svelte";\n</script>`,
    },
    {
      title: 'has other import2',
      code: `<script>\nimport { once } from 'svelte/internal';\n</script>`,
      expected: `<script>\nimport { once, get_current_component } from 'svelte/internal';\n</script>`,
    },
    {
      title: 'has default imports1',
      code: `<script>\nimport * as svelteInternal from 'svelte/internal';\n</script>`,
      expected: `<script>\n  import { get_current_component } from 'svelte/internal';\nimport * as svelteInternal from 'svelte/internal';\n</script>`,
    },
    {
      title: 'has default imports2',
      code: `<script>\nimport svelteInternal from 'svelte/internal';\n</script>`,
      expected: `<script>\n  import { get_current_component } from 'svelte/internal';\nimport svelteInternal from 'svelte/internal';\n</script>`,
    },
  ];

  for (const testCase of testCases) {
    it(testCase.title, () => {
      const magicContent = new MagicString.default(testCase.code);
      addImport(
        {
          from: 'svelte/internal',
          name: 'get_current_component',
          content: testCase.code,
          parsed: parse(testCase.code),
          magicContent,
        },
        {}
      );
      expect(magicContent.toString()).toBe(testCase.expected);
    });
  }
});
