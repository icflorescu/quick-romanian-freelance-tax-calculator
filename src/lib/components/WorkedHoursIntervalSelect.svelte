<script lang="ts">
  export let id: string;
  export let value: 'week' | 'month';
  export let disabled: boolean;
</script>

<select {id} class="root" bind:value {disabled}>
  <option value="week">săptămână</option>
  <option value="month">lună</option>
</select>

<style lang="scss">
  .root {
    text-align: center;
    flex: 0 0 110px;
  }
</style>
