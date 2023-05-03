<script>
  import { delegatedEventsHandler } from "svelte-preprocess-delegate-events/runtime";
  // @ts-ignore
  import Sub from "./Sub.svelte";

  const onClick = () => {
    console.log("fire!");
  };

  /** @type {typeof Sub} */
  let Sub0;
  $: delegatedEventsHandler(Sub0, ['foo', 'bar'], onClick);
</script>

<Sub bind:this={Sub0} />
