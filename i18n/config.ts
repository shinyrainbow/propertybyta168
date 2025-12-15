export const locales = ['th', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'th';

export const localeNames: Record<Locale, string> = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
};

export const localeFlags: Record<Locale, string> = {
  th: '🇹🇭',
  en: '🇺🇸',
  zh: '🇨🇳',
};
