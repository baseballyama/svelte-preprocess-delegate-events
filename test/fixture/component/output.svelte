<script>
  import { get_current_component } from 'svelte/internal';
  import { boundComponents } from 'svelte-preprocess-delegate-events/runtime';
  import { proxyCallbacks } from 'svelte-preprocess-delegate-events/runtime';
  // @ts-ignore
  import Sub from "./Sub.svelte";

  const Sub0 = boundComponents();
  const component0 = get_current_component();
  $: proxyCallbacks(component0, Sub0.bounds, false);
  </script>

<Sub bind:this={Sub0.bounds} />
