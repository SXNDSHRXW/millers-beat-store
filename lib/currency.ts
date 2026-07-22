import { useEffect, useState } from 'react';

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'CHF'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'PLN';

export const currencyOptions: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

const countryCurrencyMap: Record<string, CurrencyCode> = {
  US: 'USD',
  GB: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  PT: 'EUR',
  IE: 'EUR',
  AT: 'EUR',
  GR: 'EUR',
  FI: 'EUR',
  LU: 'EUR',
  SI: 'EUR',
  LV: 'EUR',
  LT: 'EUR',
  EE: 'EUR',
  SK: 'EUR',
  CY: 'EUR',
  MT: 'EUR',
  CA: 'CAD',
  AU: 'AUD',
  JP: 'JPY',
  CH: 'CHF',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  PL: 'PLN',
};

const localeCurrencyMap: Record<string, CurrencyCode> = {
  'en-GB': 'GBP',
  'fr-FR': 'EUR',
  'de-DE': 'EUR',
  'es-ES': 'EUR',
  'it-IT': 'EUR',
  'nl-NL': 'EUR',
  'pt-PT': 'EUR',
  'ja-JP': 'JPY',
  'en-CA': 'CAD',
  'fr-CA': 'CAD',
  'en-AU': 'AUD',
  'de-CH': 'CHF',
  'fr-CH': 'CHF',
  'it-CH': 'CHF',
  'sv-SE': 'SEK',
  'nb-NO': 'NOK',
  'nn-NO': 'NOK',
  'da-DK': 'DKK',
  'pl-PL': 'PLN',
};

function isCurrencyCode(value: string | null | undefined): value is CurrencyCode {
  return !!value && currencyOptions.includes(value as CurrencyCode);
}

export function getCurrencyFromCountry(countryCode?: string): CurrencyCode {
  if (!countryCode) return 'USD';
  return countryCurrencyMap[countryCode.toUpperCase()] || 'USD';
}

export function getCurrencyFromLocale(locale?: string): CurrencyCode {
  if (!locale) return 'USD';
  const normalized = locale.toLowerCase();
  const directKey = Object.keys(localeCurrencyMap).find((key) => key.toLowerCase() === normalized);
  if (directKey) return localeCurrencyMap[directKey];

  const region = locale.split(/[-_]/).pop()?.toUpperCase();
  if (region) {
    return getCurrencyFromCountry(region);
  }

  return 'USD';
}

export async function detectUserCurrency() {
  const fallbackLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  let currency = getCurrencyFromLocale(fallbackLocale);
  let countryCode: string | undefined;
  let locale = fallbackLocale;

  try {
    if (typeof window !== 'undefined') {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        countryCode = data.country_code;
        if (countryCode) {
          currency = getCurrencyFromCountry(countryCode);
        }
      }
    }
  } catch {
    // Fall back to locale-based currency detection.
  }

  return {
    currency,
    countryCode,
    locale,
  };
}

export function formatPrice(cents: number, currency: CurrencyCode = 'USD', locale = 'en-US') {
  const amount = cents / 100;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  });

  return formatter.format(amount);
}

export function useCurrencyPreference() {
  const [selectedCurrency, setSelectedCurrency] = useState<'auto' | CurrencyCode>('auto');
  const [detectedCurrency, setDetectedCurrency] = useState<CurrencyCode>('USD');
  const [locale, setLocale] = useState('en-US');

  useEffect(() => {
    let active = true;

    const loadCurrency = async () => {
      const detected = await detectUserCurrency();
      if (!active) return;

      setDetectedCurrency(detected.currency);
      setLocale(detected.locale);

      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('preferred-currency');
        if (isCurrencyCode(saved)) {
          setSelectedCurrency(saved);
        } else {
          setSelectedCurrency('auto');
        }
      }
    };

    loadCurrency();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedCurrency === 'auto' || typeof window === 'undefined') return;
    window.localStorage.setItem('preferred-currency', selectedCurrency);
  }, [selectedCurrency]);

  const activeCurrency = selectedCurrency === 'auto' ? detectedCurrency : selectedCurrency;

  return {
    activeCurrency,
    selectedCurrency,
    setSelectedCurrency,
    locale,
    detectedCurrency,
  };
}
