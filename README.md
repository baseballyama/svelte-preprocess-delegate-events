[![NPM license](https://img.shields.io/npm/l/svelte-preprocess-delegate-events.svg)](https://www.npmjs.com/package/svelte-preprocess-delegate-events)
[![NPM version](https://img.shields.io/npm/v/svelte-preprocess-delegate-events.svg)](https://www.npmjs.com/package/svelte-preprocess-delegate-events)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://github.com/baseballyama/svelte-preprocess-delegate-events/workflows/CI/badge.svg?branch=main)](https://github.com/baseballyama/svelte-preprocess-delegate-events/actions?query=workflow:ci)
[![Coverage Status](https://coveralls.io/repos/github/baseballyama/svelte-preprocess-delegate-events/badge.svg?branch=main)](https://coveralls.io/github/baseballyama/svelte-preprocess-delegate-events?branch=main)

# Delegate events with `on:*` 🎉

- 💡 Easy to use
- ⚡️ No performance impact
- 🔑 No type errors with [svelte-check](https://github.com/sveltejs/language-tools/tree/master/packages/svelte-check)

## Try it on [Stackblitz](https://stackblitz.com/edit/sveltejs-kit-template-default-rwmhls?file=src%2Froutes%2F%2Bpage.svelte&terminal=dev) 🚀.

# Overview

Since 2019, one popular issue on the Svelte GitHub repository has been delegating all events.<br>
https://github.com/sveltejs/svelte/issues/2837

This repository aims to solve this issue.

# Example

**Component.svelte**

```svelte
<!-- Delegate all events with `on:*` 🎉 -->
<input on:* />
```

**App.svelte**

```svelte
<script>
  import Component from './Component.svelte';
</script>

<!-- Handle events as desired -->
<Component
  on:input="{(e) => console.log(e.target.value)}"
  on:blur="{() => console.log('blur')}"
/>
```

# Prerequisites

This library needs Svelte 3 or Svelte 4.

# Installation

```shell
npm install -D svelte-preprocess-delegate-events
```

# Usage

After installation, add this as a Svelte preprocessor.

```js
// svelte.config.js
import delegateEvents from "svelte-preprocess-delegate-events/preprocess";

const config = {
  // Add this preprocessor at the end of the array.
  preprocess: [delegateEvents()],
};

export default config;
```

# Integration with svelte-check

If you want to use `svelte-check`, create `svelte-jsx.d.ts` at the project root and update `[tj]sconfig.json`.

**svelte-jsx.d.ts**
```ts
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

**[tj]sconfig.json**
```diff
{
+ "include": ["./svelte-jsx.d.ts"]
}
```

# How the Preprocessor Works?

This chapter explains how the preprocessor functions. The preprocessor operates differently for Elements and Components.

## Element

Consider the following simple example:

```svelte
<!-- Parant.svelte -->
<script>
  import Child from './Child.svelte';
</script>
<Child on:click={() => console.log('clicked!')} />

<!-- Child.svelte -->
<button on:*>Click Me</button>
```

Svelte executes events registered in `component.$$.callbacks` when an event is triggered in a child component. In the example above, `component.$$.callbacks` is as follows:
```js
component.$$.callbacks = {
  click: () => console.log('clicked!')
}
```

This preprocessor adds a process to listen for events registered in `component.$$.callbacks` for elements with `on:*`. After preprocessing, Child.svelte looks like this:
```svelte
<!-- Child.svelte -->
<script>
  import { boundElements, registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  let button = boundElements();
  const component = get_current_component();
  $: registerDelegatedEvents(button.bounds, component, (handler) => handler, {});
</script>

<button bind:this={button.bounds}>Click Me</button>
```
NOTE: The reason for binding `<button>` to `button.bounds` instead of binding it to the `button` variable is to support cases where multiple elements exist, such as `<button>` in a `{#each}` block.

In this way, only events that are being listened to by the parent component are listened to, thus providing a mechanism with no performance overhead.

## Component

Component uses a different mechanism than Element. Consider the following simple example:
```svelte
<!-- Parant.svelte -->
<script>
  import Child from './Child.svelte';
</script>
<Child on:click={() => console.log('clicked!')} />

<!-- Child.svelte -->
<script>
  import GrandChild from './GrandChild.svelte';
</script>
<GrandChild on:* />

<!-- GrandChild.svelte -->
<button on:click on:blur>Click Me</button>
```

If you are using `on:*` in `Child.svelte`, you need to forward all events from `GrandChild` to `Parent`. However, `Child` does not know what events are coming from `GrandChild`, so you need to do something. Specifically, when `GrandChild` triggers an event, it will refer to `component.$$.callbacks` to run its event handlers. By proxying `component.$$.callbacks`, you will know which events have been forwarded. Forwarded events can be communicated to the parent component so that the `Parent` component can handle the event.

After preprocessing, it looks like this:
```svelte
<!-- Child.svelte -->
<script>
  import { boundComponents, proxyCallbacks } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  import GrandChild from './GrandChild.svelte';

  const GrandChild = boundComponents();
  const component = get_current_component();
  $: proxyCallbacks(component, GrandChild.bounds, false);
  </script>

<GrandChild bind:this={GrandChild.bounds} />
```

# Note

`on:*` does not support specifying event handlers directly because a useful use case could not be found. If you have a useful use case, please create a new issue.

```svelte
<script>
  import Component from './Component.svelte';
  const handleEvent = (e) => {
    console.log(e);
  }
</script>

<!-- Specifying event handler directly is not supported -->
<input on:*="{handleEvent}" />

<!-- Specifying event handler directly is not supported -->
<Component on:*="{handleEvent}" />
```

# For Svelte 5 Users

For Svelte 5, event forwarding is natively supported.🎉

https://svelte-5-preview.vercel.app/docs/event-handlers#bubbling-events
