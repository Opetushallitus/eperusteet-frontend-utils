import { createLogger } from './logger';

const logger = createLogger('LocalStorage');

export function removeItem(key: string) {
  logger.debug('Removing item', normalizeKey(key));
  localStorage.removeItem(normalizeKey(key));
}

export function setItem<T>(key: string, value: T) {
  logger.debug('Setting item', normalizeKey(key), value);
  localStorage.setItem(normalizeKey(key), JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
  const value = localStorage.getItem(normalizeKey(key));
  if (value) {
    const parsed = JSON.parse(value);
    logger.debug('Getting item', normalizeKey(key), parsed);
    return parsed;
  }
  else {
    return null;
  }
}

const normalizeKey = (key: string): string => {
  return 'eperusteet-' + key;
};
