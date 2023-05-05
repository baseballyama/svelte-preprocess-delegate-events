# You can delegate events by `on:*`🎉

- 💡 Simple usage
- ⚡️ No performance overhead
- 🔑 No type error with [svelte-check](https://github.com/sveltejs/language-tools/tree/master/packages/svelte-check)

## Try this on [Stackblitz](https://stackblitz.com/) 🚀.

# What is it?

Since 2019, there is one of popular issue on Svelte GitHub repository which is delegating all events.<br>
https://github.com/sveltejs/svelte/issues/2837

The goal of this repository is sovling this issue.

<!-- TODO: UPDATE LINK -->

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
import { preprocess as delegateEvents } from "svelte-preprocess-delegate-events";

const config = {
  // Please add this preprocessor at the last of the array.
  preprocess: [delegateEvents()],
};

export default config;
```

# Type Definition

<!-- TODO: TBD -->

TBD...

# How it works?

<!-- TODO: TBD -->

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
