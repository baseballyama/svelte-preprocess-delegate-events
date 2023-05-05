<script>
  import { get_current_component } from 'svelte/internal';
  import { boundComponents } from 'svelte-preprocess-delegate-events/runtime';
  import { proxyCallbacks } from 'svelte-preprocess-delegate-events/runtime';
  // @ts-ignore
  import Sub from "./Sub.svelte";

  const numbers = [1, 2, 3];

  /** @type {any} */
  let Sub0 = boundComponents();
  const component0 = get_current_component();
  $: proxyCallbacks(component0, Sub0.bounds, false);
  </script>

{#each numbers as number}
  <Sub bind:this={Sub0.bounds} />
{/each}
