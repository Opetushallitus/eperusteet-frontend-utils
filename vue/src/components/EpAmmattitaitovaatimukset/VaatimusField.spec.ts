import { mount } from '@vue/test-utils';
import { delay } from '../../utils/delay';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import VaatimusField from './VaatimusField.vue';
import { vi } from 'vitest';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { wrap } from '../../utils/jestutils';

describe.skip('VaatimusField', () => {

  test.only('Text input', async () => {
    const editoitava = {
      koodisto: 'test',
      query: vi.fn(async (query: string, sivu = 0) => {
        return koodit as any;
      }),
    };
    const koodisto = new KoodistoSelectStore(editoitava);

    const wrapper = mount(VaatimusField, {
      props: {
        koodisto,
        modelValue: {
          koodi: null,
          vaatimus: {
            fi: 'teksti',
          },
        },
      },
      global: {
        ...globalStubs,
      },
    });

    const input = wrapper.find('.b-form-input.vaatimus').element;
    expect(input.getAttribute('value')).toBe('teksti');

    wrapper.find('input').setValue('muuta');
    await delay();
    expect(wrapper.emitted().input[0][0].vaatimus.fi).toBe('muuta');
  });

  test('Render vaatimus when koodi name not present', async () => {
    const editoitava = {
      koodisto: 'test',
      query: vi.fn(async (query: string, sivu = 0) => koodit as any),
      data: computed(() => koodit),
    };
    const koodisto = new KoodistoSelectStore(editoitava);

    const wrapper = mount(VaatimusField, {
      attachToDocument: true,
      props: {
        koodisto,
        modelValue: {
          vaatimus: {
            fi: 'vaatimuksen nimi',
          },
          koodi: {
            uri: 'ammattitaitovaatimukset_1234',
            arvo: '1234',
          },
        },
      },
      global: {
        ...globalStubs,
      },
    });

    const input = wrapper.find('input').element as any;
    expect(input.value).toBe('vaatimuksen nimi (1234)');
    expect(input.disabled).toBeTruthy();
  });

  test('Renders koodi', async () => {
    const editoitava = {
      koodisto: 'test',
      query: vi.fn(async (query: string, sivu = 0) => koodit as any),
      data: computed(() => koodit),
    };
    const koodisto = new KoodistoSelectStore(editoitava);

    const wrapper = mount(VaatimusField, {
      attachToDocument: true,
      props: {
        koodisto,
        modelValue: {
          koodi: {
            uri: 'ammattitaitovaatimukset_1234',
            arvo: '1234',
            nimi: {
              fi: 'valittu koodi',
            },
          },
        },
      },
      global: {
        ...globalStubs,
      },
    });

    const input = wrapper.find('input').element as any;
    expect(input.value).toBe('valittu koodi (1234)');
    expect(input.disabled).toBeTruthy();
  });

  test('Autocompletion', async () => {
    const editoitava = {
      koodisto: 'test',
      query: vi.fn(async (query: string, sivu = 0) => {
        return koodit as any;
      }),
    };

    const koodisto = new KoodistoSelectStore(editoitava);

    const wrapper = mount(VaatimusField, {
      attachToDocument: true,
      props: {
        koodisto,
        modelValue: {
          koodi: null,
          vaatimus: {
            fi: 'nimi',
          },
        },
      },
      global: {
        ...globalStubs,
      },
    });

    wrapper.find('input').setValue('nimi');
    wrapper.find('input').trigger('focus');
    await delay(0);
    // expect(wrapper.html()).toContain('nimi 1234');
    // wrapper.findAll('.item').at(0)
    // .trigger('click');

    await delay();

    // expect(wrapper.html()).not.toContain('nimi 1234');
    // expect(wrapper.emitted().input[0][0].nimi).toBeFalsy();
    // expect(wrapper.emitted().input[0][0].koodi).toEqual(
    //   expect.objectContaining({
    //     uri: 'ammattitaitovaatimukset_1234',
    //     arvo: '1234',
    //   }));
  });
});

const koodit = {
  data: [{
    koodiUri: 'ammattitaitovaatimukset_1234',
    koodiArvo: '1234',
    versio: '1',
    metadata: [{
      nimi: 'nimi 1234',
      kieli: 'FI',
      kuvaus: 'kuvaus 1234',
    }],
    koodisto: {
      koodistoUri: 'ammattitaitovaatimukset',
      latestKoodistoVersio: null,
    },
    voimassaAlkuPvm: 1576713600000,
    voimassaLoppuPvm: null,
  }],
};
