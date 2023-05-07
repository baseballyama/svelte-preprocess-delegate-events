<script>
  import { boundElements } from 'svelte-preprocess-delegate-events/runtime';
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';

  const button0 = boundElements();
  const component0 = get_current_component();
  $: registerDelegatedEvents(button0.bounds, component0, (handler) => handler, {});

  const button1 = boundElements();
  $: registerDelegatedEvents(button1.bounds, component0, (handler) => handler, {});

  const button2 = boundElements();
  $: registerDelegatedEvents(button2.bounds, component0, (handler) => handler, {});

  const button3 = boundElements();
  $: registerDelegatedEvents(button3.bounds, component0, (handler) => handler, {});

  const button4 = boundElements();
  $: registerDelegatedEvents(button4.bounds, component0, (handler) => handler, {});

  const button5 = boundElements();
  $: registerDelegatedEvents(button5.bounds, component0, (handler) => handler, {});

  const button6 = boundElements();
  $: registerDelegatedEvents(button6.bounds, component0, (handler) => handler, {});
</script>

<button bind:this={button0.bounds}>Click Me</button>
<button bind:this={button1.bounds}>Click Me</button>
<button bind:this={button2.bounds}>Click Me</button>
<button bind:this={button3.bounds}>Click Me</button>
<button bind:this={button4.bounds}>Click Me</button>
<button bind:this={button5.bounds}>Click Me</button>
<button bind:this={button6.bounds}>Click Me</button>
