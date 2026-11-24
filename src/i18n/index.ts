import en from './en.json';
import ru from './ru.json';

export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export type LocaleProps = { locale: Locale };
export const defaultLocale: Locale = 'en';
export const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

const dictionaries: Record<Locale, typeof en> = { en, ru };

export function getLocale(value: string | undefined): Locale {
  return locales.find((locale) => locale === value) ?? defaultLocale;
}

export function getMessages(locale: Locale) {
  return dictionaries[locale];
}

export function localePath(locale: Locale) {
  return locale === defaultLocale ? `${basePath}/` : `${basePath}/${locale}`;
}

export function formatMessage(message: string, values: Record<string, string | number>) {
  return message.replace(/\{(\w+)\}/g, (placeholder, key) => String(values[key] ?? placeholder));
}
