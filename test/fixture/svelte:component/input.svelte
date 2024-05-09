<script lang="ts">
  import Component from './Component.svelte';
  import Component2 from './Component2.svelte';

  const a = false;
</script>

{#if a}
  <svelte:component this={Component} on:* />
{:else}
  <svelte:component this={Component2} on:* />
{/if}
