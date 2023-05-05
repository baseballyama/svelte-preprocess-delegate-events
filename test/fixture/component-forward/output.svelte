<script>
  import {register_delegated_events} from 'svelte-preprocess-delegate-events/runtime'
  import Sub from "./Sub.svelte";

  const onInput = () => {
    console.log("input");
  };

  let sub;
  $: register_delegated_events(sub, {input: onInput})
</script>

<Sub on:input="{onInput}" />
