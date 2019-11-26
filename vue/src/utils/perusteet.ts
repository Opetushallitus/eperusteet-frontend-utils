import _ from 'lodash';
import { Koulutustyyppi } from '@shared/tyypit';

const themes = {
  'koulutustyyppi_1': 'ammatillinen',
  'koulutustyyppi_11': 'ammatillinen',
  'koulutustyyppi_12': 'ammatillinen',
  'koulutustyyppi_5': 'ammatillinen',
  'koulutustyyppi_18': 'ammatillinen',
  'koulutustyyppi_14': 'lukio',
  'koulutustyyppi_15': 'esiopetus',
  'koulutustyyppi_16': 'perusopetus',
  'koulutustyyppi_17': 'perusopetus',
  'koulutustyyppi_2': 'lukio',
  'koulutustyyppi_20': 'varhaiskasvatus',
  'koulutustyyppi_22': 'perusopetus',
  'koulutustyyppi_23': 'lukio',
  'koulutustyyppi_6': 'perusopetus',
  'koulutustyyppi_999907': 'taiteenperusopetus',
};

const themeColors = {
  'ammatillinen': [0, 136, 0],
  'esiopetus': [132, 210, 255],
  'lukio': [1, 67, 218],
  'perusopetus': [103, 204, 204],
  'varhaiskasvatus': [255, 204, 51],
  'taiteenperusopetus': [250, 204, 234],
};

const ktToState = {
  'koulutustyyppi_1': 'ammatillinenperustutkinto',
  'koulutustyyppi_11': 'ammattitutkinto',
  'koulutustyyppi_12': 'erikoisammattitutkinto',
  'koulutustyyppi_14': 'aikuistenlukiokoulutus',
  'koulutustyyppi_15': 'esiopetus',
  'koulutustyyppi_16': 'perusopetus',
  'koulutustyyppi_17': 'aikuistenperusopetus',
  'koulutustyyppi_18': 'valma',
  'koulutustyyppi_2': 'lukiokoulutus',
  'koulutustyyppi_20': 'varhaiskasvatus',
  'koulutustyyppi_22': 'perusopetukseenvalmistava',
  'koulutustyyppi_23': 'valmistavalukiokoulutus',
  'koulutustyyppi_5': 'telma',
  'koulutustyyppi_6': 'lisaopetus',
  'koulutustyyppi_999907': 'taiteenperusopetus',
};

const ktToUrlShortParam = {
  'koulutustyyppi_16': 'perusopetus',
  'koulutustyyppi_2': 'lukiokoulutus',
  'koulutustyyppi_999907': 'tpo',
};

const perusteToUrlShortParam = {
  'koulutustyyppi_16': 'perusopetus',
  'koulutustyyppi_2': 'lukio',
  'koulutustyyppi_999907': 'tpo',
};

const stateToKt = _.zipObject(
  _.values(ktToState),
  _.keys(ktToState),
);

export function koulutustyyppiStateName(koulutustyyppi: string) {
  return ktToState[koulutustyyppi] || koulutustyyppi;
}

export function stateToKoulutustyyppi(statename: string) {
  return stateToKt[statename];
}

export function koulutustyyppiUrlShortParamName(koulutustyyppi: string) {
  return ktToUrlShortParam[koulutustyyppi] || koulutustyyppiStateName(koulutustyyppi);
}

export function perusteKoulutustyyppiUrlShortParamName(koulutustyyppi: string) {
  return perusteToUrlShortParam[koulutustyyppi] || koulutustyyppiStateName(koulutustyyppi);
}

// Koulutustyyppi on oltava myös alityyppinä
export function koulutustyyppiRelaatiot() {
  return [{
    koulutustyyppi: 'koulutustyyppi_20',
    alityypit: ['koulutustyyppi_20'],
  }, {
    koulutustyyppi: 'koulutustyyppi_15',
    alityypit: ['koulutustyyppi_15'],
  }, {
    koulutustyyppi: 'koulutustyyppi_16',
    alityypit: [
      'koulutustyyppi_16',
      'koulutustyyppi_17',
      'koulutustyyppi_22',
    ],
  }, {
    koulutustyyppi: 'koulutustyyppi_999907',
    alityypit: [
      'koulutustyyppi_999907',
    ],
  }, {
    koulutustyyppi: 'koulutustyyppi_2',
    alityypit: [
      'koulutustyyppi_2',
      'koulutustyyppi_23',
    ],
  }];
}


export function ryhmat(koulutustyyppi: string) {
  const relaatiot = koulutustyyppiRelaatiot();
  const idx = _.findIndex(relaatiot, { koulutustyyppi });
  if (idx >= 0) {
    return relaatiot[idx].alityypit;
  }
  else {
    return [koulutustyyppi];
  }
}

export function isAmmatillinen(statename: string): boolean {
  const koulutustyyppi = stateToKoulutustyyppi(statename);
  return themes[koulutustyyppi] === 'ammatillinen';
}

export function koulutustyyppiTheme(koulutustyyppi: string) {
  return themes[koulutustyyppi] || koulutustyyppi;
}

export function koulutustyyppiThemeColor(koulutustyyppi: string) {
  return themeColors[themes[koulutustyyppi]] || [255, 255, 255];
}

export function rgb2string(color: number[]) {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

export function calculateVisibleColor(bgRGBColor = [0, 0, 0], limit = 125): string {
  // http://www.w3.org/TR/AERT#color-contrast
  const value = Math.round(((bgRGBColor[0] * 299) + (bgRGBColor[1] * 587) + (bgRGBColor[2] * 114)) / 1000);
  if (value > limit) {
    return 'black';
  }
  else {
    return 'white';
  }
}

export function ammatilliset() {
  return [{
    name: 'ammatillinen-koulutus',
    route: {
      name: 'ammatillinenSelaus',
    },
  }];
}

export function yleissivistavat() {
  return _.map(koulutustyyppiRelaatiot(), kt => {
    return {
      ...kt,
      name: koulutustyyppiStateName(kt.koulutustyyppi),
      route: {
        name: 'kooste',
        params: {
          koulutustyyppi: koulutustyyppiStateName(kt.koulutustyyppi),
        },
      },
    };
  });
}

export function getLaajaAlaisetKoodit() {
  return [{
    koodi: 'lops2019laajaalainenosaaminen_1',
    nimi: {
      fi: 'Globaali- ja kulttuuriosaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_2',
    nimi: {
      fi: 'Hyvinvointiosaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_3',
    nimi: {
      fi: 'Vuorovaikutusosaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_4',
    nimi: {
      fi: 'Eettisyys ja ympäristöosaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_5',
    nimi: {
      fi: 'Yhteiskunnallinen osaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_6',
    nimi: {
      fi: 'Monitieteinen ja luova osaaminen',
    },
  }];
}

