import { mount } from '@vue/test-utils';
import EpEditointi from './EpEditointi.vue';
import { IEditoitava } from './EditointiStore';
import { Kielet } from '../../stores/kieli';
import _ from 'lodash';
import { Oikeustarkastelu } from '../../plugins/oikeustarkastelu';
import { VueTutorial } from '../../plugins/tutoriaali';
import { delay } from '../../utils/delay';
import { findContaining, mockEditointiStore } from '../../utils/jestutils';
import VueI18n from 'vue-i18n';
import { vi } from 'vitest';

// import '../../config/bootstrap';
import { computed, reactive } from 'vue';
import { ref } from 'vue';
import Vue from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { defineComponent } from 'vue';
import { nextTick } from 'vue';

vi.mock('vue-router', () => (
  {
    useRoute: vi.fn(),
    useRouter: vi.fn(),
  }));

function mockAndWrapper(extension: Partial<IEditoitava> = {}, template?: string) {
  const { store, config } = mockEditointiStore({
    load: vi.fn(async () => {
      return {
        name: 'foo',
        description: 'xyz',
        test: 'testi',
      };
    }),
    ...extension,
  });

  const TestComponent = defineComponent({
    components: {
      EpEditointi,
    },
    data() {
      return {
        store,
      };
    },
    template: template || `
      <div>
        <ep-editointi :store="store">
          <template v-slot:header="{ data, isEditing }">
            <h1>{{ data.name }}</h1>
          </template>
          <template v-slot:default="{ data, supportData, isEditing }">
            <p>{{ data.description }}</p>
            <pre>{{ supportData }}</pre>
          </template>
        </ep-editointi>
      </div>
    `,
  });


  const wrapper = mount(TestComponent, {
    global: {
      ...globalStubs,
      stubs: {
        ...globalStubs.stubs,
        'ep-versio-modaali': true,
      },

    },
  });

  return {store, config, wrapper };
}

describe('EpEditointi component', () => {
  test('Renders header and content', async () => {

    const { store, config, wrapper } = mockAndWrapper();
    await delay();
    expect(config.load).toBeCalledTimes(1);
    expect(config.lock).toBeCalledTimes(1);
    expect(config.revisions).toBeCalledTimes(1);
    expect(config.start).toBeCalledTimes(0);
    expect(config.acquire).toBeCalledTimes(0);
    expect(config.cancel).toBeCalledTimes(0);
    expect(config.editAfterLoad).toBeCalledTimes(1);
    expect(wrapper.html()).toMatch(/<h1.*?>foo<\/h1>/);
    expect(wrapper.html()).toMatch(/<p.*?>xyz<\/p>/);
  });

  test('Can edit after create', async () => {
    const { store, config, wrapper } = mockAndWrapper({
      async editAfterLoad() {
        return true;
      },
    });
    await delay();

    expect(config.start).toBeCalledTimes(1);

    findContaining(wrapper, '.b-button', 'peruuta')!.trigger('click');
    await delay();
  });

  test('Can add additional data', async () => {
    const data = { name: 'name' };
    const { store, config, wrapper } = mockAndWrapper({
      async editAfterLoad() {
        return true;
      },
      save: vi.fn(async () => { }),
      load: vi.fn(async (supportFn) => {
        supportFn({
          testi: 123,
        });
        return {
          name: 456,
          description: 789,
        };
      }),
    });
    await delay();
    expect(wrapper.html()).toContain('123');
    expect(wrapper.html()).toContain('456');
    expect(wrapper.html()).toContain('789');
    await delay();
  });

  test('Can save', async () => {
    const data = { name: 'name' };
    const { store, config, wrapper } = mockAndWrapper({
      async editAfterLoad() {
        return true;
      },
      save: vi.fn(async () => {
        data.name = 'uusi';
      }),
      load: vi.fn(async () => data),
    });
    await delay();
    findContaining(wrapper, '.b-button', 'tallenna')!.trigger('click');
    await delay();
    await nextTick();
    expect(config.start).toBeCalledTimes(1);
    expect(config.save).toBeCalledTimes(1);
    expect(config.release).toBeCalledTimes(1);
    expect(store.data.value.name).toContain('uusi');
  });

  test('Shows latest revision info', async () => {
    const data = { name: 'name' };
    const { store, config, wrapper } = mockAndWrapper({
      revisions: vi.fn(async () => [{
        numero: 1,
        pvm: new Date(),
        muokkaajaOid: 'muokkaajaOid1234',
        kutsumanimi: 'etunimi',
        sukunimi: 'sukunimi',
      }]),
    });
    await delay();
    expect(wrapper.html()).toContain('etunimi sukunimi');
  });

  test('Feature picking', async () => {
    const features = reactive({
      editable: false,
      removable: false,
      lockable: false,
      validated: false,
      recoverable: false,
    });

    const { store, config, wrapper } = mockAndWrapper({
      features: () => {
        return computed(() => features);
      },
    }, `
      <ep-editointi :store="store">
        <template v-slot:default="{ data, isEditing }">
          <input v-model="data.name" />
          <pre>editing {{ isEditing }}</pre>
        </template>
      </ep-editointi>
    `);
    await delay();
    expect(findContaining(wrapper, '.b-button', 'muokkaa')).toBeNull();

    features.editable = true;
    await delay();
    expect(findContaining(wrapper, '.b-button', 'muokkaa')).toBeTruthy();
  });

  test('Can start and cancel editing', async () => {
    const { store, config, wrapper } = mockAndWrapper({}, `
      <ep-editointi :store="store">
        <template v-slot:default="{ data, isEditing }">
          <input v-model="data.name" />
          <pre>editing {{ isEditing }}</pre>
        </template>
      </ep-editointi>
    `);
    await delay();

    expect(wrapper.html()).toContain('>editing false</pre>');
    findContaining(wrapper, '.b-button', 'muokkaa')!.trigger('click');
    await delay();

    wrapper.find('input').setValue('uusi nimi');
    expect(store.data.value.name).toEqual('uusi nimi');
    expect(config.start).toBeCalledTimes(1);
    expect(config.acquire).toBeCalledTimes(1);
    expect(wrapper.html()).toContain('>editing true</pre>');

    findContaining(wrapper, '.b-button', 'peruuta')!.trigger('click');
    await delay();
    expect(config.release).toBeCalledTimes(1);
    expect(config.cancel).toBeCalledTimes(1);
    expect(store.data.value.name).toEqual('foo');
  });
});
