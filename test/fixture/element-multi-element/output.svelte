<script>
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';

  /** @type {Element} */
  let button0;
  const component0 = get_current_component();
  $: registerDelegatedEvents(button0, component0, (handler) => handler, {});

  /** @type {Element} */
  let button1;
  $: registerDelegatedEvents(button1, component0, (handler) => handler, {});

  /** @type {Element} */
  let button2;
  $: registerDelegatedEvents(button2, component0, (handler) => handler, {});

  /** @type {Element} */
  let button3;
  $: registerDelegatedEvents(button3, component0, (handler) => handler, {});

  /** @type {Element} */
  let button4;
  $: registerDelegatedEvents(button4, component0, (handler) => handler, {});

  /** @type {Element} */
  let button5;
  $: registerDelegatedEvents(button5, component0, (handler) => handler, {});

  /** @type {Element} */
  let button6;
  $: registerDelegatedEvents(button6, component0, (handler) => handler, {});
</script>

<button bind:this={button0}>Click Me</button>
<button bind:this={button1}>Click Me</button>
<button bind:this={button2}>Click Me</button>
<button bind:this={button3}>Click Me</button>
<button bind:this={button4}>Click Me</button>
<button bind:this={button5}>Click Me</button>
<button bind:this={button6}>Click Me</button>
