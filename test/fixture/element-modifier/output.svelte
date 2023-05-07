<button bind:this={button0.bounds}>Click Me</button>

<script>
  import { boundElements } from 'svelte-preprocess-delegate-events/runtime';
  import { prevent_default } from 'svelte/internal';
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  const button0 = boundElements();
  const component0 = get_current_component();
  $: registerDelegatedEvents(button0.bounds, component0, (handler) => prevent_default(handler), {});
</script>