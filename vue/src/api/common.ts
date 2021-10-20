import axios from 'axios';
import { createLogger } from '../utils/logger';
import _ from 'lodash';
import { Virheet } from '@shared/stores/virheet';
import { localhostOrigin } from '@shared/utils/esikatselu';

const logger = createLogger('AxiosCommon');

axios.defaults.headers.common['Caller-Id'] = '1.2.246.562.10.00000000001.eperusteet';
axios.defaults.xsrfCookieName = 'CSRF';
axios.defaults.xsrfHeaderName = 'CSRF';

export function axiosHandler(msg: string) {
  return async (err: any) => {
    throw err;
  };
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
    const casKayttaja = _.get(await axios.get(`${location.protocol}//${location.host}/cas/me`), 'data');
    return _.get(casKayttaja, 'lang');
  }
  catch (e) {
    logger.error(e);
    return 'fi';
  }
}

export async function getCasKayttaja() {
  try {
    const casKayttaja = await successfulResponseHandler()(await axios.get(`${location.protocol}//${location.host}/cas/me`));
    return _.get(casKayttaja, 'data');
  }
  catch (e) {
    logger.error(e);
    return null;
  }
}
