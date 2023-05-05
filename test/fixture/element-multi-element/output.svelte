<script>
  import { registerDelegatedEvents } from 'svelte-preprocess-delegate-events/runtime';
  import { get_current_component } from 'svelte/internal';
  const onClick = () => {
    console.log("clicked");
  };

  let button0;
  const component1 = get_current_component();
  $: registerDelegatedEvents(button0, component1, (handler) => handler, {});

  let button1;
  $: registerDelegatedEvents(button1, component1, (handler) => handler, {});

  let button2;
  $: registerDelegatedEvents(button2, component1, (handler) => handler, {});

  let button3;
  $: registerDelegatedEvents(button3, component1, (handler) => handler, {});

  let button4;
  $: registerDelegatedEvents(button4, component1, (handler) => handler, {});

  let button5;
  $: registerDelegatedEvents(button5, component1, (handler) => handler, {});

  let button6;
  $: registerDelegatedEvents(button6, component1, (handler) => handler, {});
</script>

<button bind:this={button0}>Click Me</button>
<button bind:this={button1}>Click Me</button>
<button bind:this={button2}>Click Me</button>
<button bind:this={button3}>Click Me</button>
<button bind:this={button4}>Click Me</button>
<button bind:this={button5}>Click Me</button>
<button bind:this={button6}>Click Me</button>
