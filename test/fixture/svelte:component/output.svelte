<script lang="ts">
  import { get_current_component } from 'svelte/internal';
  import { boundComponents } from 'svelte-preprocess-delegate-events/runtime';
  import { proxyCallbacks } from 'svelte-preprocess-delegate-events/runtime';
  import Component from './Component.svelte';
  import Component2 from './Component2.svelte';

  const a = false;

  const svelte_component0 = boundComponents();
  const component0 = get_current_component();
  $: proxyCallbacks(component0, svelte_component0.bounds, false);
  
  const svelte_component1 = boundComponents();
  $: proxyCallbacks(component0, svelte_component1.bounds, false);
  </script>

{#if a}
  <svelte:component this={Component} bind:this={svelte_component0.bounds} />
{:else}
  <svelte:component this={Component2} bind:this={svelte_component1.bounds} />
{/if}
