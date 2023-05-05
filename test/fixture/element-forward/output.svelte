<button bind:this={button0}>Click Me</button>

<script>
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  let button0;
  const component1 = get_current_component();
  $: registerDelegatedEvents(button0, component1, (handler) => handler, {});
</script>