<script lang="ts">
  import { CURRENCIES } from '$lib/config';

  export let id: string;
  export let value: string;
  export let disabled: boolean;
</script>

<select {id} bind:value {disabled}>
  {#each CURRENCIES as c (c)}
    <option value={c}>{c}</option>
  {/each}
</select>

<style lang="scss">
  select {
    flex: 0 0 60px;
  }
</style>
