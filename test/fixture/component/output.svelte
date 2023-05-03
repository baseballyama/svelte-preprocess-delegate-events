<script>
  import { delegatedEventsHandler } from "svelte-preprocess-delegate-events/runtime";
  // @ts-ignore
  import Sub from "./Sub.svelte";

  const onClick = () => {
    console.log("click");
  };

  /** @type {typeof Sub} */
  let Sub0;
  $: delegatedEventsHandler(Sub0, ['*'], onClick);
</script>

<Sub bind:this={Sub0} />
