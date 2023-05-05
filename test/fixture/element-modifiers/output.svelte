<script>
  import { prevent_default } from 'svelte/internal';
  import { stop_propagation } from 'svelte/internal';
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';

  let button0;
  const component1 = get_current_component();
  $: registerDelegatedEvents(button0, component1, (handler) => prevent_default(stop_propagation(handler)), {});
</script>

<button bind:this={button0}>Click Me</button>
