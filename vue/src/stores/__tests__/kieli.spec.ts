import { createLocalVue } from '@vue/test-utils';
import { Kieli } from '../../tyypit';
import { UiKielet, KieliStore, Kielet } from '../kieli';
import _ from 'lodash';


describe('Kielet', () => {
  const localVue = createLocalVue();

  KieliStore.setup(localVue);
  const i18n = KieliStore.i18n;

  beforeEach(() => {
    i18n.locale = Kieli.fi;
    Kielet.setSisaltoKieli(Kieli.fi);
  });

  test('UI-kieli', async () => {
    expect(Kielet.getUiKieli()).toEqual(i18n.locale);
    i18n.locale = Kieli.sv;
    expect(Kielet.getUiKieli()).toEqual(i18n.locale);
  });

  test('Sisältökieli', async () => {
    expect(Kielet.getSisaltoKieli()).toEqual(Kieli.fi);

    Kielet.setSisaltoKieli(Kieli.sv);
    expect(Kielet.getSisaltoKieli()).toEqual(Kieli.sv);
  });

  test('Ui käännökset', async () => {
    await KieliStore.load(async () => {
      return {
        fi: [{
          key: 'kieli-sisalto',
          value: 'suomeksi',
        }],
        sv: [{
          key: 'kieli-sisalto',
          value: 'ruotsiksi',
        }],
      };
    });

    expect(i18n.t('kieli-sisalto')).toEqual('suomeksi');
    i18n.locale = Kieli.sv;
    expect(i18n.t('kieli-sisalto')).toEqual('ruotsiksi');
  });

  test('Käännösten lataus', async () => {
    await KieliStore.load(async () => {
      return {
        fi: [{
          key: 'testiavain',
          value: 'testiarvo',
        }],
        sv: [],
      };
    });

    expect(i18n.t('testiavain')).toEqual('testiarvo');
  });

  test('Käännösten lataus virheellisillä arvoilla', async () => {
    await KieliStore.load(async () => {
      return {
        fi: [{
          key: 'testiavain',
          value: 'testiarvo',
        }],
        sv: [{
          value: 'testiarvo',
        }, {
          key: 'testiavain',
        }],
        ru: [],
      } as any;
    });

    expect(i18n.t('testiavain')).toEqual('testiarvo');
  });

  test('Käännösten lataus apin ollessa rikki', async () => {
    const errorSpy = jest.spyOn(console, 'error');
    errorSpy.mockImplementationOnce((...args: any) => undefined);
    await KieliStore.load(async () => {
      throw new Error('500');
    });

    expect(errorSpy).toBeCalled();
  });
});
