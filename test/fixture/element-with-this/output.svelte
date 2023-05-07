<script>
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  let button;
  
  const component0 = get_current_component();
  $: registerDelegatedEvents(button, component0, (handler) => handler, {});
  </script>

<button  bind:this={button}>Click Me</button>
