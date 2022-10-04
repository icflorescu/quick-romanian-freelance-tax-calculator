<script lang="ts">
  export let value: string;
  export let disabled: boolean;
</script>

<select class="root" bind:value {disabled}>
  <option value="month">pe lună</option>
  <option value="year">pe an</option>
</select>

<style lang="scss">
  .root {
    text-align: center;
    flex: 0 0 90px;
  }
</style>
