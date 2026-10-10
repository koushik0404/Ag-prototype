import en from './en.json';
import te from './te.json';

const translations: Record<string, any> = { en, te };

export function translate(lang: string, key: string): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}