<script>
  import { delegatedEventsHandler } from "svelte-preprocess-delegate-events/runtime";
  import { once } from "svelte/internal";
  // @ts-ignore
  import Sub from "./Sub.svelte";

  const onClick = () => {
    console.log("click");
  };

  /** @type {typeof Sub} */
  let Sub0;
  $: delegatedEventsHandler(Sub0, ['*'], once(onClick));
</script>

<Sub bind:this={Sub0} />
