<script lang="ts">
  export let id: string;
  export let value: number;
  export let disabled: boolean;
</script>

<input {id} type="number" placeholder="ore…" {disabled} bind:value />

<style lang="scss">
  input {
    flex: 1 1 auto;
    max-width: 36px;
  }
</style>
