<script lang="ts">
  import { BASE_CURRENCY, EXCHANGE_RATE_FORMATTER } from '$lib/config';
  import { slide } from 'svelte/transition';

  export let exchangeRates: Record<string, number>;
  export let currency: string;
</script>

{#if exchangeRates && currency !== BASE_CURRENCY}
  <div class="root" transition:slide>
    Curs de schimb: {EXCHANGE_RATE_FORMATTER.format(1 / exchangeRates[currency])} RON/{currency}
  </div>
{/if}

<style lang="scss">
  .root {
    margin: 2em auto;
    font-size: 0.9em;
    color: rgba($text-color, 0.5);
    background: rgba(white, 0.025);
    padding: 0.5em 0.75em;
    border-radius: 0.5em;
    width: fit-content;
  }
</style>
