import axios from 'axios';
import { createLogger } from '../utils/logger';
import _ from 'lodash';
import { Kielet } from '../stores/kieli';
import { $fail, $t } from '../utils/globals';
import { Virheet } from '@shared/stores/virheet';
import { Kieli } from '@shared/tyypit';

const logger = createLogger('AxiosCommon');

axios.defaults.headers.common['Caller-Id'] = '1.2.246.562.10.00000000001.eperusteet';
axios.defaults.xsrfCookieName = 'CSRF';
axios.defaults.xsrfHeaderName = 'CSRF';

export function axiosHandler(msg: string) {
  return async (err: any) => {
    console.log('axiosHandler', err);
    // if (err?.response?.status === 500 || err?.response?.status === 403 || err?.response?.status === 400 || err?.response?.status === 409) {
    $fail(errorMessage(err), undefined, errorNotificationDuration());
    // }
    Virheet.lisaaVirhe({});
    throw err;
  };
}

function errorMessage(err) {
  if (err?.response?.status === 403) {
    return 'ei-oikeutta-suorittaa';
  }

  if (err?.response?.status === 400 && !!err.response?.data?.syy) {
    if (_.isArray(err.response.data.syy)) {
      return err.response.data.syy.map(s => Kielet.kaannaOlioTaiTeksti(s)).join(', ');
    }
    return Kielet.kaannaOlioTaiTeksti(err.response?.data?.syy);
  }

  return 'jarjestelmavirhe-ohje';
}

function errorNotificationDuration() {
  return window.location.hostname === 'localhost' ? 2000 : 120000;
}

// Apufuntio kirjautumiseen ja paluulinkin luontiin
function getCasURL() {
  const host = location.host;
  const protocol = location.protocol;
  const redirectURL = encodeURIComponent(window.location.origin + window.location.pathname);
  return protocol + '//' + host + '/cas/login?service=' + redirectURL;
}

export function successfulResponseHandler() {
  return async (res: any) => {
    try {
      if (res.status === 200) {
        const url = new URL(res.request.responseURL);
        if (_.startsWith(url.pathname, '/cas/login')) {
          // Uudelleenohjataan kirjautumiseen jos nykyinen pyyntö on jo mennyt kirjautumissivulle
          window.location.href = getCasURL();
        }
      }
    }
    catch (e) {
      return res;
    }
    return res;
  };
}

export async function getCasKayttajaKieli() {
  try {
    const casKayttaja = _.get(await axios.get(`${location.protocol}//${location.host}/kayttooikeus-service/cas/me`), 'data');
    return _.get(casKayttaja, 'lang') || Kieli.fi;
  }
  catch (e) {
    logger.error(e);
    return Kieli.fi;
  }
}

export async function getCasKayttaja() {
  try {
    const casKayttaja = await successfulResponseHandler()(await axios.get(`${location.protocol}//${location.host}/kayttooikeus-service/cas/me`));
    return _.get(casKayttaja, 'data');
  }
  catch (e) {
    logger.error(e);
    return null;
  }
}
