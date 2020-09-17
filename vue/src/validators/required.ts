import _ from 'lodash';
import he from 'he';
import { Kieli } from '@shared/tyypit';
import { CustomRule, ValidationRule, helpers, minLength, minValue as vMinValue, required } from 'vuelidate/lib/validators';

export function notNull() {
  return {
    'not-null': (value: any) => !!value,
  };
}

const ValidoitavatKielet = ['fi', 'sv', 'se', 'en', 'ru'];

function exists(value: any, kieli: Kieli) {
  return _.has(value, kieli) && !_.isEmpty(value[kieli])
    && !_.isEmpty(he.decode(value[kieli].replace(/<[^>]+>/g, '')).trim());
}

export function warning(x: CustomRule | ValidationRule) {
  return helpers.withParams({ type: 'warning' }, x);
}

export const requiredOneLang = () => {
  return {
    'required-one-lang': (value: any) => {
      return _.some(ValidoitavatKielet, kieli => exists(value, kieli as Kieli));
    },
  };
};

export const allTranslations = (kielet: readonly Kieli[]) => {
  return {
    'all-translations': warning((value: any) => {
      if (!value) {
        return false;
      }
      return _.every(kielet, kieli => exists(value, kieli));
    }),
  };
};

export const translated = (kielet: readonly Kieli[]) => {
  return {
    ...requiredOneLang(),
    ...allTranslations(kielet),
  };
};

export function requiredLokalisoituTeksti(kielet?: readonly Kieli[]) {
  return {
    required(value: any) {
      if (!value) {
        return false;
      }

      const isInSomeLang = () => _.some(ValidoitavatKielet, kieli => exists(value, kieli as Kieli));
      if (_.isEmpty(kielet)) {
        return isInSomeLang();
      }

      const isMaaritettyInAllLangs = () => _.every(kielet, kieli => exists(value, kieli));
      const isValid = _.isEmpty(kielet) ? isInSomeLang() : isMaaritettyInAllLangs();
      return isValid;
    },
  };
}

export function minValue(value: number) {
  return {
    'min-value': vMinValue(value),
  };
}

export function nimiValidator(kielet: Kieli[]) {
  return {
    nimi: {
      ...requiredLokalisoituTeksti(kielet),
    },
  };
}

export function koodiValidator(min = 3) {
  return {
    koodi: {
      required,
      'min-length': minLength(min),
    },
  };
}
