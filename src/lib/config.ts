export const BASE_MONTHLY_INCOME = 3_000;
export const PENSION_PERCENTAGE = 0.25;
export const HEALTH_PERCENTAGE = 0.1;
export const INCOME_TAX_PERCENTAGE = 0.1;
export const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'RON'];
export const BASE_CURRENCY = 'RON';
export const VAT_THRESHOLD = 300_000;

export const EXCHANGE_RATES_RELOAD_INTERVAL = 3_600_000;
export const WEEKS_PER_CALENDAR_YEAR = 52.1429;

export const STANDARD_FORMATTER = new Intl.NumberFormat('ro-RO', {
  maximumFractionDigits: 2,
});

export const EXCHANGE_RATE_FORMATTER = new Intl.NumberFormat('ro-RO', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});
