import _ from 'lodash';

export function buildEsikatseluUrl(kieli, path) {
  return `${buildLangUrl(kieli)}${path}`;
}

export function buildLangUrl(kieli) {
  return `${buildBetaUrl()}/#/${kieli}`;
}

export function buildBetaUrl() {
  return `${buildBaseUrl()}/beta`;
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
