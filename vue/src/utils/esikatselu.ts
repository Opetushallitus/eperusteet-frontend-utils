import _ from 'lodash';

export function buildEsikatseluUrl(kieli, path) {
  return `${buildLangUrl(kieli)}${path}?esikatselu`;
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
