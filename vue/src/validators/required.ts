import _ from 'lodash';
import he from 'he';
import { Kieli } from '@shared/tyypit';
import { ValidationRule } from '@vuelidate/core';
import { helpers, minLength, minValue as vMinValue, required, maxLength } from '@vuelidate/validators';
import { Kielet } from '@shared/stores/kieli';

export function notNull() {
  return {
    'not-null': (value: any) => !!value,
  };
}

const ValidoitavatKielet = ['fi', 'sv', 'se', 'en', 'ru'];
const strictCodeValidator = /^[a-zA-Z0-9äöåÄÖÅ]([a-zA-Z0-9äöåÄÖÅ ,.-]*[a-zA-Z0-9äöåÄÖÅ])?$/;

export const onlyCharacterOrNumber = (value: any) => {
  if (!value) return true; // Allow empty values
  return strictCodeValidator.test(String(value));
};

export const langStrictCodeValidator = () => {
  return {
    'strict-code-validator': (value: any) => {
      if (!value) return true;
      const sisaltoKieli = Kielet.getSisaltoKieli.value;
      const langValue = _.get(value, sisaltoKieli);
      if (!langValue) return true;
      return strictCodeValidator.test(String(langValue));
    },
  };
};

const onlyNumbers = (value: any) => {
  if (!value) return true; // Allow empty values
  const regex = /^[0-9._-]*$/;
  return regex.test(String(value));
};

function exists(value: any, kieli: Kieli) {
  return _.has(value, kieli) && !_.isEmpty(value[kieli])
    && !_.isEmpty(he.decode(value[kieli].replace(/<[^>]+>/g, '')).trim());
}

export function warning(x: ValidationRule) {
  return helpers.withParams({ type: 'warning' }, x);
}

export const requiredOneLang = () => {
  return {
    'required-one-lang': (value: any) => {
      return _.some(ValidoitavatKielet, kieli => exists(value, kieli as Kieli));
    },
  };
};

export const langMaxLength = (length: number) => {
  return {
    'max-length': (value: any) => {
      return _.every(ValidoitavatKielet, kieli => _.size(_.get(value, kieli)) <= length);
    },
  };
};

export const langMinLength = (length: number) => {
  return {
    ['min-length-' + length]: (value: any) => {
      return _.some(ValidoitavatKielet, kieli => _.size(_.get(value, kieli)) >= length);
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

export function koodiValidator(min = 3, allowEmpty = false, allowOnlyNumbers = false) {
  return {
    koodi: {
      ...(!allowEmpty && { required }),
      'min-length': minLength(min),
      ...(!allowOnlyNumbers && { onlyCharacterOrNumber }),
      ...(allowOnlyNumbers && { onlyNumbers }),
    },
  };
}

export function koodistoKoodiValidator() {
  return {
    nimi: {
      ...requiredOneLang(),
      ...langMaxLength(256),
    },
  };
}
