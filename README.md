[![NPM license](https://img.shields.io/npm/l/svelte-preprocess-delegate-events.svg)](https://www.npmjs.com/package/svelte-preprocess-delegate-events)
[![NPM version](https://img.shields.io/npm/v/svelte-preprocess-delegate-events.svg)](https://www.npmjs.com/package/svelte-preprocess-delegate-events)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://github.com/baseballyama/svelte-preprocess-delegate-events/workflows/CI/badge.svg?branch=main)](https://github.com/baseballyama/svelte-preprocess-delegate-events/actions?query=workflow:ci)
[![Coverage Status](https://coveralls.io/repos/github/baseballyama/svelte-preprocess-delegate-events/badge.svg?branch=main)](https://coveralls.io/github/baseballyama/svelte-preprocess-delegate-events?branch=main)

# You can delegate events by `on:*`🎉

- 💡 Simple usage
- ⚡️ No performance overhead
- 🔑 No type error with [svelte-check](https://github.com/sveltejs/language-tools/tree/master/packages/svelte-check)

## Try this on [Stackblitz](https://stackblitz.com/edit/sveltejs-kit-template-default-rwmhls?file=src%2Froutes%2F%2Bpage.svelte&terminal=dev) 🚀.

# What is it?

Since 2019, there is one of popular issue on Svelte GitHub repository which is delegating all events.<br>
https://github.com/sveltejs/svelte/issues/2837

The goal of this repository is sovling this issue.

# Example

**Component.svelte**

```svelte
<!-- You can delegate all events by `on:*` 🎉 -->
<input on:* />
```

**App.svelte**

```svelte
<script>
  import Component from './Component.svelte';
</script>

<!-- You can handle events whatever you want -->
<Component
  on:input="{(e) => console.log(e.target.value)}"
  on:blur="{() => console.log('blur')}"
/>
```

# Installation

```shell
npm install -D svelte-preprocess-delegate-events
```

# Usage

After install it, please add this as a Svelte preprocessor.

```js
// svelte.config.js
import delegateEvents from "svelte-preprocess-delegate-events/preprocess";

const config = {
  // Please add this preprocessor at the last of the array.
  preprocess: [delegateEvents()],
};

export default config;
```

# Use with `svelte-check`

If you want to use `svelte-check`, please create `svelte-jsx.d.ts` at project root.

```ts
// svelte-jsx.d.ts
declare namespace svelteHTML {
  /**
   * base: https://github.com/sveltejs/language-tools/blob/651db67858d18ace44d000d263ac57ed5590ea05/packages/svelte2tsx/svelte-jsx.d.ts#L42
   */
  type HTMLProps<Property extends string, Override> =
    Omit<
      Omit<import('svelte/elements').SvelteHTMLElements[Property], keyof EventsWithColon<Omit<svelte.JSX.IntrinsicElements[Property & string], svelte.JSX.AttributeNames>>> & EventsWithColon<Omit<svelte.JSX.IntrinsicElements[Property & string], svelte.JSX.AttributeNames>>,
      keyof Override
    > & Override & (Record<'on:*', (event: Event & { currentTarget: EventTarget & EventTarget }) => any | never> | object);
}
```

# How it works?



TBD...

# Note

`on:*` doesn't support event handling because I couldn't find useful usecase.
If you have a useful usecase, please create a new issue.

```svelte
<script>
  import Component from './Component.svelte';
  const handleEvent = (e) => {
    console.log(e);
  }
</script>

<!-- Specifying event handler does not support -->
<input on:*="{handleEvent}" />

<!-- Specifying event handler does not support -->
<Component on:*="{handleEvent}" />
```
