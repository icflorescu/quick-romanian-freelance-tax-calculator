<script lang="ts">
  import { STANDARD_FORMATTER, VAT_THRESHOLD } from '$lib/config';
  import { slide } from 'svelte/transition';

  export let annualIncome: number;
</script>

{#if annualIncome >= VAT_THRESHOLD}
  <div transition:slide>
    Atenție!
    <br />
    Estimezi un venit anual de {STANDARD_FORMATTER.format(annualIncome)} RON.
    <br />
    Dacă depășești {STANDARD_FORMATTER.format(VAT_THRESHOLD)} RON trebuie
    <br />
    să te înregistrezi ca plătitor de TVA!
  </div>
{/if}

<style lang="scss">
  div {
    margin: 2em auto;
    font-size: 0.9em;
    color: $warning-color;
    background: rgba(white, 0.025);
    padding: 0.5em 0.75em;
    border-radius: 0.5em;
    width: fit-content;
    text-align: center;
  }
</style>
