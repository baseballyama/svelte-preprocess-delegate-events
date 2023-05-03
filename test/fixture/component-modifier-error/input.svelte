<script>
  // @ts-ignore
  import Sub from "./Sub.svelte";

  const onClick = () => {
    console.log("click");
  };
</script>

<Sub on:*|preventDefault="{onClick}" />
