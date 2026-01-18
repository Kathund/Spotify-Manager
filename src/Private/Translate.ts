import SpotifyManagerError from './Error.js';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import type { Language } from '../Types/Data.js';

function parseKeyForTranslation(key: string): string {
  return key.replaceAll('/', '.');
}

// eslint-disable-next-line import/exports-last
export function getSupportedLanguages(): Language[] {
  try {
    if (!existsSync('./Translations')) throw new Error('Translations are missing');
    const translations = readdirSync('./Translations');
    return translations.filter((lang) => lang.endsWith('.json')).map((lang) => lang.split('.')[0] as Language);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// eslint-disable-next-line import/exports-last
export function getSelectedLanguage(): Language {
  try {
    const lang = process.env.LANGUAGE as Language;
    if (!getSupportedLanguages().includes(lang)) throw new Error('Invalid language found. Please check your config');
    return lang;
  } catch (error) {
    console.log(error);
    return 'en_us';
  }
}

function logMissingTranslation(key: string, lang: Language = getSelectedLanguage()) {
  if (!existsSync('./Translations')) mkdirSync('./Translations/', { recursive: true });
  if (!existsSync('./Translations/missing')) mkdirSync('./Translations/missing/', { recursive: true });
  if (!existsSync(`./Translations/missing/${lang}.json`)) {
    writeFileSync(`./Translations/missing/${lang}.json`, JSON.stringify({}));
  }
  const missingFile = readFileSync(`./Translations/missing/${lang}.json`);
  if (!missingFile) throw new SpotifyManagerError("The missing Translations file doesn't exist");
  const missing = JSON.parse(missingFile.toString('utf8'));
  if (!missing) throw new SpotifyManagerError('The missing Translations file is malformed.');
  missing[key] = `Could not find translation for \`${key}\` in \`${lang}\``;
  writeFileSync(`./Translations/missing/${lang}.json`, JSON.stringify(missing, null, 2));
}

export function getTranslations(lang: Language = getSelectedLanguage()): { [key: string]: string } {
  try {
    if (!getSupportedLanguages().includes(lang)) {
      throw new SpotifyManagerError(`Translations are missing for ${lang} language`);
    }
    const translationsFile = readFileSync(`./Translations/${lang}.json`);
    if (!translationsFile) throw new SpotifyManagerError(`The ${lang} Translations file doesn't exist`);
    const translations = JSON.parse(translationsFile.toString('utf8'));
    if (!translations) throw new SpotifyManagerError(`The ${lang} Translations file is malformed`);
    return translations;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export function unTranslate(translation: string, lang: Language = getSelectedLanguage()): string {
  const supportedLanguages = getSupportedLanguages();
  if (!supportedLanguages.includes(lang)) return `Unsupported Language | ${translation}`;
  const translations = getTranslations(lang);
  const entry = Object.entries(translations).find(([, value]) => value === translation);
  if (!entry) {
    return lang === 'en_us' ? `Unknown Key | ${translation}` : unTranslate(translation, 'en_us');
  }
  return entry[0];
}

export default function Translate(key: string, lang: Language = getSelectedLanguage()): string {
  key = parseKeyForTranslation(key);
  const supportedLanguages = getSupportedLanguages();
  if (!supportedLanguages.includes(lang)) return `Unsupported Language | ${key}`;
  const translations = getTranslations(lang);
  let translation = translations[key];
  if (translation === undefined) {
    const parts = key.split('.');
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'generic') continue;
      const genericParts = [...parts];
      genericParts[i] = 'generic';
      const genericKey = genericParts.join('.');
      if (translations[genericKey] !== undefined) {
        translation = translations[genericKey];
        break;
      }
    }
  }
  if (translation === undefined) {
    logMissingTranslation(key, lang);
    return lang === 'en_us' ? `Unknown Translation | ${key}` : Translate(key, 'en_us');
  }
  return translation;
}
