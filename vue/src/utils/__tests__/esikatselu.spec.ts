import { buildEsikatseluUrl } from '../esikatselu';

describe('Esikatselu URL', () => {
  function setOrigin(origin) {
    delete window.location;
    window.location = {
      origin,
    } as any;
  }

  test('Localhost linkki', () => {
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('http://localhost:9020/beta/#/fi/testi');
  });

  test('Production linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/beta/#/fi/testi');
  });

  test('QA linkki', () => {
    setOrigin('https://virkailija.testiopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.testiopintopolku.fi/beta/#/fi/testi');
  });

  test('Hahtuva linkki', () => {
    setOrigin('https://virkailija.hahtuvaopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.hahtuvaopintopolku.fi/beta/#/fi/testi');
  });

  test('Untuva linkki', () => {
    setOrigin('https://virkailija.untuvaopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.untuvaopintopolku.fi/beta/#/fi/testi');
  });

  test('Kieli linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('sv', '/testi');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/beta/#/sv/testi');
  });

  test('Esikatselu linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/opetussuunnitelma/1/lukiokoulutus/tiedot');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/beta/#/fi/opetussuunnitelma/1/lukiokoulutus/tiedot');
  });
});
