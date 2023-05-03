# svelte-preprocess-delegate-events

You can delegate events by `on:*`🎉

# What is it?

Since 2019, there is one of popular issue on Svelte GitHub repository which is delegating all events.
https://github.com/sveltejs/svelte/issues/2837

THe goal of this repository is sovling this issue.

# Installation

```shell
npm install svelte-preprocess-delegate-events
```

After install, please add this as a Svelte preprocessor.

**svelte.config.js**

```js
import { preprocess as delegateEvents } from "svelte-preprocess-delegate-events";

const config = {
  // Please add this preprocessor at the last of the array.
  preprocess: [delegateEvents],
};

export default config;
```
