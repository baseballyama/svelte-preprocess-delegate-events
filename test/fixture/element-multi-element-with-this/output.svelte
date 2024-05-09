<script>
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  let button1;
  let button2;
  
  const component0 = get_current_component();
  $: registerDelegatedEvents(button1, component0, (handler) => handler, {});
    
  $: registerDelegatedEvents(button2, component0, (handler) => handler, {});
  </script>

<button  bind:this={button1}>Click Me</button>
<button  bind:this={button2}>Click Me</button>
