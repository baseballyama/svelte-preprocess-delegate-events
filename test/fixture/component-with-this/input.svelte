<script>
  // @ts-ignore
  import Sub from './Sub.svelte';

  let sub;
</script>

<Sub on:* bind:this={sub} />
