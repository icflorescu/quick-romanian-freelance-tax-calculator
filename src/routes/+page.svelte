<!-- @hmr:keep-all -->
<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import CurrencySelect from '$lib/components/CurrencySelect.svelte';
  import ExchangeRate from '$lib/components/ExchangeRate.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import IncomeInput from '$lib/components/IncomeInput.svelte';
  import IntervalSelect from '$lib/components/IntervalSelect.svelte';
  import TaxDetails from '$lib/components/TaxDetails.svelte';
  import VatNotice from '$lib/components/VatNotice.svelte';
  import WorkedHoursInput from '$lib/components/WorkedHoursInput.svelte';
  import WorkedHoursIntervalSelect from '$lib/components/WorkedHoursIntervalSelect.svelte';
  import {
    BASE_CURRENCY,
    BASE_MONTHLY_INCOME,
    CURRENCIES,
    EXCHANGE_RATES_RELOAD_INTERVAL,
    HEALTH_PERCENTAGE,
    INCOME_TAX_PERCENTAGE,
    PENSION_PERCENTAGE,
    STANDARD_FORMATTER,
    WEEKS_PER_CALENDAR_YEAR,
  } from '$lib/config';
  import { onDestroy, onMount } from 'svelte';

  let exchangeRates: Record<string, number>;
  $: disabled = !exchangeRates;

  let income: number;
  let currency: string;
  let interval: 'hour' | 'month' | 'year';
  let workedHours: number;
  let workedHoursInterval: 'week' | 'month';

  const loadInputFromLocalStorage = () => {
    if (typeof window === 'undefined') return;
    const values = localStorage.getItem('values');
    if (values) {
      try {
        ({
          income,
          currency = 'EUR',
          interval = 'month',
          workedHours = 20,
          workedHoursInterval = 'week',
        } = JSON.parse(values));
      } catch {
        console.error('Error while trying to load values from localStorage');
        localStorage.removeItem('values');
      }
    }
  };

  loadInputFromLocalStorage();

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
    loadInputFromLocalStorage();
    loadExchangeRates();
    exchangeRatesLoadingInterval = setInterval(loadExchangeRates, EXCHANGE_RATES_RELOAD_INTERVAL);
  });

  onDestroy(() => {
    clearInterval(exchangeRatesLoadingInterval);
  });

  $: {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'values',
        JSON.stringify({ income, currency, interval, workedHours, workedHoursInterval }),
      );
    }
    if (exchangeRates) {
      let computedAnnualIncome: number;
      if (interval === 'hour') {
        computedAnnualIncome =
          income * workedHours * (workedHoursInterval === 'month' ? 12 : WEEKS_PER_CALENDAR_YEAR);
      } else if (interval === 'month') {
        computedAnnualIncome = income * 12;
      } else {
        computedAnnualIncome = income;
      }
      if (currency !== BASE_CURRENCY) {
        computedAnnualIncome = computedAnnualIncome / exchangeRates[currency];
      }
      annualIncome = computedAnnualIncome;

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
  }
</script>

<Header />
<Card>
  <label class="label" for="income">{income ? 'Dintr-un venit de' : 'Venit'}</label>
  <div class="inputs">
    <IncomeInput id="income" {disabled} bind:value={income} />
    <label for="currency">de</label>
    <CurrencySelect id="currency" bind:value={currency} {disabled} />
    <label for="interval">pe</label>
    <IntervalSelect id="interval" bind:value={interval} {disabled} />
  </div>
  {#if interval === 'hour'}
    <div class="inputs">
      <label for="workedHours">La</label>
      <WorkedHoursInput id="workedHours" {disabled} bind:value={workedHours} />
      <label for="workedHoursInterval">de ore pe</label>
      <WorkedHoursIntervalSelect
        id="workedHoursInterval"
        bind:value={workedHoursInterval}
        {disabled}
      />
    </div>
  {/if}
</Card>
<Card visible={!!annualTaxPercentage}>
  <div class="label">Statul îți va lua în 2023</div>
  <div class="tax tax-percentage">{STANDARD_FORMATTER.format(annualTaxPercentage)}%</div>
  <div>Adică</div>
  <div class="tax tax-amount">{STANDARD_FORMATTER.format(annualTaxAmount)} RON</div>
  {#if interval !== 'year'}
    <div>Echivalentul a</div>
    <div class="tax tax-amount smaller">
      {STANDARD_FORMATTER.format(
        (annualTaxAmount * (currency === BASE_CURRENCY ? 1 : exchangeRates[currency])) /
          (interval === 'hour'
            ? (workedHoursInterval === 'week' ? WEEKS_PER_CALENDAR_YEAR : 12) * workedHours
            : interval === 'month'
            ? 12
            : 1),
      )}
      {currency}
      {#if interval === 'hour'}
        <span>/oră</span>
      {/if}
      {#if interval === 'month'}
        <span>/lună</span>
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
    align-items: baseline;
    width: fit-content;
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
