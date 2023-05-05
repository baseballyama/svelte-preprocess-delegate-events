<script>
  import Sub from "./Sub.svelte";
</script>

<Sub on:*="{() => console.log('hi')}" />
