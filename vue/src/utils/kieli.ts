import _ from 'lodash';
import { Kielet } from '../stores/kieli';

export function highlight(nimi, query: string) {
  if (!query) {
    return nimi;
  }

  return (nimi || '').replace(new RegExp(query, 'ig'), (match) => '<mark>' + match + '</mark>');
}

/**
 * Onko lokalisoidusta tekstistä sisältöä vain jollain muulla kuin valitulla sisältökielellä
 */
export function kaannosPuuttuu(value: any): boolean {
  if (!_.isPlainObject(value) || value[Kielet.getSisaltoKieli.value]) {
    return false;
  }

  return _.some(['fi', 'sv', 'en', 'se', 'ru'], kieli => !!value[kieli]);
}
