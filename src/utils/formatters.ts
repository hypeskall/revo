import { Currency } from '@/types';

export function formatCurrencyAmount(
  amount: number,
  currency: Currency,
  options?: {
    showDecimalsIfZero?: boolean;
    useFormalCode?: boolean;
    includeSign?: boolean;
  }
): string {
  const { showDecimalsIfZero = true, useFormalCode = false, includeSign = false } = options || {};
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Check if has fractional part
  const hasFractions = absAmount % 1 !== 0;
  const minimumFractionDigits = (hasFractions || showDecimalsIfZero) ? 2 : 0;
  const maximumFractionDigits = 2;

  // Format with Romanian / European locale (dot for thousands, comma for decimals)
  const formattedNumber = new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(absAmount);

  let signPrefix = '';
  if (includeSign) {
    signPrefix = isNegative ? '- ' : '+ ';
  } else if (isNegative) {
    signPrefix = '-';
  }

  if (useFormalCode) {
    // e.g. "610,00 RON" or "25,00 EUR"
    return `${signPrefix}${formattedNumber} ${currency}`;
  }

  switch (currency) {
    case 'RON':
      return `${signPrefix}${formattedNumber} lei`;
    case 'EUR':
      return `${signPrefix}${formattedNumber} €`;
    case 'USD':
      return `${signPrefix}${formattedNumber} $`;
    case 'GBP':
      return `${signPrefix}${formattedNumber} £`;
    default:
      return `${signPrefix}${formattedNumber} ${currency}`;
  }
}

export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'RON':
      return 'lei';
    case 'EUR':
      return '€';
    case 'USD':
      return '$';
    case 'GBP':
      return '£';
  }
}

export function getCurrencyFlag(currency: Currency): string {
  switch (currency) {
    case 'RON':
      return '🇷🇴';
    case 'EUR':
      return '🇪🇺';
    case 'USD':
      return '🇺🇸';
    case 'GBP':
      return '🇬🇧';
  }
}
