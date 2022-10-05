<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import CurrencySelect from '$lib/components/CurrencySelect.svelte';
  import ExchangeRate from '$lib/components/ExchangeRate.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import IntervalSelect from '$lib/components/IntervalSelect.svelte';
  import TaxDetails from '$lib/components/TaxDetails.svelte';
  import VatNotice from '$lib/components/VatNotice.svelte';
  import {
    BASE_CURRENCY,
    BASE_MONTHLY_INCOME,
    CURRENCIES,
    HEALTH_PERCENTAGE,
    INCOME_TAX_PERCENTAGE,
    PENSION_PERCENTAGE,
    STANDARD_FORMATTER,
  } from '$lib/config';
  import { onDestroy, onMount } from 'svelte';

  let exchangeRates: Record<string, number>;
  let income: number;
  let currency = 'RON';
  let interval: 'month' | 'year' = 'month';
  let annualIncome: number;
  let annualPension: number;
  let annualHealth: number;
  let annualIncomeTaxAmount: number;
  let annualTaxPercentage: number;
  let annualTaxAmount: number;

  const loadExchangeRates = async () => {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${BASE_CURRENCY}`);
    if (res.ok) {
      const data: { rates: Record<string, number> } = await res.json();
      if (!exchangeRates) exchangeRates = {};
      for (const c in data.rates) {
        if (CURRENCIES.includes(c)) exchangeRates[c] = data.rates[c];
      }
      exchangeRates = data.rates;
    }
  };

  let exchangeRatesLoadingInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    loadExchangeRates();
    exchangeRatesLoadingInterval = setInterval(loadExchangeRates, 3_600_000);
  });

  onDestroy(() => {
    clearInterval(exchangeRatesLoadingInterval);
  });

  $: {
    annualIncome =
      (interval === 'month' ? 12 * income : income) /
      (currency === BASE_CURRENCY ? 1 : exchangeRates[currency]);
    annualPension =
      (annualIncome > 24 * BASE_MONTHLY_INCOME
        ? 24
        : annualIncome > 12 * BASE_MONTHLY_INCOME
        ? 12
        : 0) *
      BASE_MONTHLY_INCOME *
      PENSION_PERCENTAGE;
    annualHealth =
      (annualIncome > 24 * BASE_MONTHLY_INCOME
        ? 24
        : annualIncome > 12 * BASE_MONTHLY_INCOME
        ? 12
        : annualIncome > 6 * BASE_MONTHLY_INCOME
        ? 6
        : 0) *
      BASE_MONTHLY_INCOME *
      HEALTH_PERCENTAGE;
    annualIncomeTaxAmount = (annualIncome - annualPension) * INCOME_TAX_PERCENTAGE;
    annualTaxAmount = annualPension + annualHealth + annualIncomeTaxAmount;
    annualTaxPercentage = (annualTaxAmount * 100) / annualIncome;
  }
</script>

<Header />
<Card>
  <label class="label" for="income">{income ? 'Dintr-un venit de' : 'Venit'}</label>
  <div class="inputs">
    <input
      id="income"
      class="income-input"
      type="number"
      placeholder="venit estimat…"
      disabled={!exchangeRates}
      bind:value={income}
    />
    <CurrencySelect bind:value={currency} disabled={!exchangeRates} />
    <IntervalSelect bind:value={interval} disabled={!exchangeRates} />
  </div>
</Card>
<Card visible={!!annualTaxPercentage}>
  <div class="label">Statul îți va lua în 2023</div>
  <div class="tax tax-percentage">{STANDARD_FORMATTER.format(annualTaxPercentage)}%</div>
  <div>Adică</div>
  <div class="tax tax-amount">{STANDARD_FORMATTER.format(annualTaxAmount)} RON</div>
  {#if currency !== BASE_CURRENCY}
    <div>Echivalentul a</div>
    <div class="tax tax-amount smaller">
      {STANDARD_FORMATTER.format(
        (annualTaxAmount * exchangeRates[currency]) / (interval === 'month' ? 12 : 1),
      )}
      {currency}
      {#if interval === 'month'}
        <span> / lună</span>
      {/if}
    </div>
  {/if}
  <div>Reprezentând</div>
  <TaxDetails {annualPension} {annualHealth} {annualIncomeTaxAmount} />
</Card>
<VatNotice {annualIncome} />
<ExchangeRate {exchangeRates} {currency} />
<Footer />

<style lang="scss">
  .label {
    display: block;
    font-size: 1.66em;
    text-align: center;
  }

  .inputs {
    display: flex;
    gap: 0.5em;
    justify-content: center;
    width: fit-content;
  }

  .income-input {
    flex: 1 1 110px;
    max-width: 110px;
  }

  .tax {
    text-align: center;
    background: rgba(black, 0.1);
    border-radius: 0.75em;
  }

  .tax-percentage {
    font-size: 3em;
    font-weight: bold;
    padding: 0.1em 0.5em;
    margin-bottom: 0.5em;
  }

  .tax-amount {
    font-size: 2em;
    padding: 0.1em 0.66em;
    margin-bottom: 0.75em;
    &.smaller {
      font-size: 1.5em;
    }
  }
</style>
