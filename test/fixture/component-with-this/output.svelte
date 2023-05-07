<script>
  import { get_current_component } from 'svelte/internal';
  import { boundComponents } from 'svelte-preprocess-delegate-events/runtime';
  import { proxyCallbacks } from 'svelte-preprocess-delegate-events/runtime';
  // @ts-ignore
  import Sub from './Sub.svelte';

  let sub;

  const component0 = get_current_component();
  $: proxyCallbacks(component0, sub.bounds, false);
  </script>

<Sub  bind:this={sub} />
