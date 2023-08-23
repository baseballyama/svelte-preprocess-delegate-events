<script>
  import { boundElements } from 'svelte-preprocess-delegate-events/runtime';
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  export let tag = 'p';

  const svelte_element0 = boundElements();
  const component0 = get_current_component();
  $: registerDelegatedEvents(svelte_element0.bounds, component0, (handler) => handler, {});
</script>

<svelte:element this={tag} bind:this={svelte_element0.bounds}>Click Me</svelte:element>
