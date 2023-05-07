<script>
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  let list = [0, 1, 2];
  let button;
  
  const component0 = get_current_component();
  $: registerDelegatedEvents(button.foo, component0, (handler) => handler, {});
  </script>

{#each list as item, index}
  <button  bind:this={button.foo[index]}>Click Me</button>
{/each}
