<script lang="ts">
  export let id: string;
  export let value: 'hour' | 'month' | 'year';
  export let disabled: boolean;
</script>

<select {id} bind:value {disabled}>
  <option value="hour">oră</option>
  <option value="month">lună</option>
  <option value="year">an</option>
</select>

<style lang="scss">
  select {
    flex: 0 0 60px;
  }
</style>
