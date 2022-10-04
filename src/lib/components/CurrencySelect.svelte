<script lang="ts">
  import { CURRENCIES } from '$lib/config';

  export let value: string;
  export let disabled: boolean;
</script>

<select class="root" bind:value {disabled}>
  {#each CURRENCIES as c (c)}
    <option value={c}>{c}</option>
  {/each}
</select>

<style lang="scss">
  .root {
    text-align: center;
    flex: 0 0 60px;
  }
</style>
