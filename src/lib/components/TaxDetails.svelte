<script lang="ts">
  import { INTEGER_FORMATTER } from '$lib/config';
  export let annualPension: number;
  export let annualHealth: number;
  export let annualIncomeTaxAmount: number;
</script>

<div class="root">
  <div class="detail">CAS (pensie)</div>
  <div class="detail amount">{INTEGER_FORMATTER.format(annualPension)} RON</div>
  <div class="detail">CASS (sănătate)</div>
  <div class="detail amount">{INTEGER_FORMATTER.format(annualHealth)} RON</div>
  <div class="detail">Impozit pe venit</div>
  <div class="detail amount">{INTEGER_FORMATTER.format(annualIncomeTaxAmount)} RON</div>
</div>

<style lang="scss">
  .root {
    background: rgba(black, 0.05);
    border-radius: 0.25em;
    display: flex;
    flex-wrap: wrap;
    row-gap: 0.5em;
    padding: 0.5em 1em;
  }

  .detail {
    flex: 1 1 50%;
  }

  .amount {
    text-align: right;
  }
</style>
