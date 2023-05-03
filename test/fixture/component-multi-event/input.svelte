<script>
  // @ts-ignore
  import Sub from "./Sub.svelte";

  const onClick = () => {
    console.log("fire!");
  };
</script>

<Sub on:foo,bar="{onClick}" />
