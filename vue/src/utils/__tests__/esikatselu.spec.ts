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
    expect(url).toEqual('http://localhost:9020/#/fi/testi?esikatselu');
  });

  test('Production linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/#/fi/testi?esikatselu');
  });

  test('QA linkki', () => {
    setOrigin('https://virkailija.testiopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.testiopintopolku.fi/#/fi/testi?esikatselu');
  });

  test('Hahtuva linkki', () => {
    setOrigin('https://virkailija.hahtuvaopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.hahtuvaopintopolku.fi/#/fi/testi?esikatselu');
  });

  test('Untuva linkki', () => {
    setOrigin('https://virkailija.untuvaopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.untuvaopintopolku.fi/#/fi/testi?esikatselu');
  });

  test('Kieli linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('sv', '/testi');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/#/sv/testi?esikatselu');
  });

  test('Esikatselu linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/opetussuunnitelma/1/lukiokoulutus/tiedot');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/#/fi/opetussuunnitelma/1/lukiokoulutus/tiedot?esikatselu');
  });
});
