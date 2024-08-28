import { Kielet } from '@shared/stores/kieli';
import _ from 'lodash';
import { koulutustyyppiTheme, tyyppiTheme } from './perusteet';

export function buildKatseluUrl(kieli, path, revision?, postPath?) {
  return `${buildLangUrl(kieli)}${path}` + (revision ? `/${revision}` : '') + (postPath || '');
}

export function buildEsikatseluUrl(kieli, prePath, postPath?) {
  return buildKatseluUrl(kieli, prePath, '0', postPath);
}

export function buildLangUrl(kieli) {
  return `${buildBetaUrl()}/#/${kieli}`;
}

export function buildVanhaUiUrl(kieli: string) {
  return `${buildBaseUrl()}/vanha-ui/#/${kieli}`;
}

export function buildBetaUrl() {
  return `${buildBaseUrl()}`;
}

export function buildBaseUrl() {
  const origin = window.location.origin;
  if (_.includes(origin, 'localhost')) {
    return 'http://localhost:9020';
  }
  else {
    return origin.replace(/virkailija/g, 'eperusteet');
  }
}

export function localhostOrigin() {
  const origin = window.location.origin;
  return _.includes(origin, 'localhost');
}

export function osaamismerkkiUrl(kieli, koodi) {
  return `${buildBaseUrl()}/#/${kieli}/osaamismerkki/${koodi}`;
}
