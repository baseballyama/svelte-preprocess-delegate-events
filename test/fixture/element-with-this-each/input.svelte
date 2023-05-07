<script>
  let list = [0, 1, 2];
  let button;
</script>

{#each list as item, index}
  <button on:* bind:this={button[index]}>Click Me</button>
{/each}
