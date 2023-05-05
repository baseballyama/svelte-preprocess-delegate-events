<script>
  // @ts-ignore
  import Sub from "./Sub.svelte";

  const numbers = [1, 2, 3];
</script>

{#each numbers as number}
  <Sub on:* />
{/each}
