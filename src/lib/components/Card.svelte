<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  export let visible = true;
</script>

{#if visible}
  <div in:slide out:fade>
    <slot />
  </div>
{/if}

<style lang="scss">
  div {
    border-radius: 0.5em;
    margin: 2em auto;
    padding: 1em;
    background: rgba(white, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    gap: 0.75em;
  }
</style>
