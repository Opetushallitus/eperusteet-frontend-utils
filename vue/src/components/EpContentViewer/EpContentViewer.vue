<template>
  <div
    v-if="valueFormatted"
    ref="contentContainer"
  >
    <div
      class="teksti"
      v-html="valueFormatted"
    />
    <div
      v-for="(viite, idx) in termitWrapped"
      :key="idx"
    >
      <template v-if="viite">
        <b-popover
          v-if="viite.el && viite.termi"
          :target="viite.el"
          triggers="click blur"
          placement="bottom"
          @shown="termiAriaNakyviin(viite.termi.avain)"
          @hidden="termiAriaPiiloon(viite.termi.avain)"
        >
          <template
            v-if="viite.termi.selitys"
            #title
          >
            {{ $kaanna(viite.termi.termi) }}
          </template>
          <div v-if="!viite.termi.selitys">
            {{ $kaanna(viite.termi.termi) }}
          </div>
          <div
            v-if="viite.termi.selitys"
            v-html="$kaanna(viite.termi.selitys)"
          />
        </b-popover>
        <div
          class="sr-only"
          aria-live="polite"
        >
          <span v-if="nakyvatTermit.includes(viite.termi.avain)">
            {{ $kaanna(viite.termi.selitys) }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, inject } from 'vue';
import _ from 'lodash';
import { LiiteDtoWrapper } from '../../tyypit';
import { Kielet } from '../../stores/kieli';
import { ILinkkiHandler } from '../EpContent/LinkkiHandler';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  value: {
    type: String,
    required: false,
  },
  termit: {
    type: Array,
    required: false,
    default: () => [],
  },
  kuvat: {
    type: Array as () => LiiteDtoWrapper[],
    required: false,
    default: () => [],
  },
});

const contentContainer = ref<HTMLDivElement | null>(null);
const linkkiHandler = inject<ILinkkiHandler>('linkkiHandler');

const termiElements = ref<Element[]>([]);
const nakyvatTermit = ref<string[]>([]);

const $route = useRoute();
const $router = useRouter();

const valueFormatted = computed(() => {
  if (props.value) {
    const template = document.createElement('template');
    template.innerHTML = props.value;

    // Taulukot
    const tables = template.content.querySelectorAll('table');
    _.each(tables, table => {
      table.setAttribute('class', 'table table-bordered');
      const wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'table-responsive');
      table.parentNode!.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Kuvat
    const images = template.content.querySelectorAll('img');
    _.each(images, img => {
      // Kääritään figureen
      const wrapper = document.createElement('figure');
      if (img.parentNode) {
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }

      const datauid = img.getAttribute('data-uid');
      if (!datauid) {
        console.error('virheellinen kuva id');
        return;
      }

      const kuva = _.find(props.kuvat, { id: datauid }) as LiiteDtoWrapper;

      const id = _.get($route, 'params.toteutussuunnitelmaId');
      if (!kuva && id) {
        img.setAttribute('src', `eperusteet-amosaa-service/api/opetussuunnitelmat/${id}/kuvat/${datauid}`);
      }
      else if (kuva) {
        img.setAttribute('src', kuva.src);
        const altteksti = !!img.getAttribute('alt') && img.getAttribute('alt') !== 'undefined' ? img.getAttribute('alt') : '';
        const kuvateksti = img.getAttribute('figcaption');
        const figcaption = document.createElement('figcaption');
        if (!kuvateksti) {
          figcaption.textContent = altteksti;
          img.setAttribute('alt', Kielet.t('kuvituskuva'));
        }
        else {
          figcaption.textContent = kuvateksti;
        }

        if (figcaption.textContent) {
          wrapper.appendChild(figcaption);
        }
      }
    });

    // Linkit
    const links = template.content.querySelectorAll('a');
    _.each(links, link => {
      const href = link.getAttribute('href');
      // Jos ulkoinen linkki
      if (href && href.charAt(0) !== '#') {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }

      const routeNode = link.getAttribute('routenode');
      if (routeNode && linkkiHandler) {
        const newLocation = $router.resolve(linkkiHandler.nodeToRoute(JSON.parse(routeNode)));
        if (newLocation) {
          link.setAttribute('href', newLocation.href);
          link.removeAttribute('target');
          link.removeAttribute('rel');
        }
      }
    });

    return template.innerHTML;
  }
  return '';
});

const termitWrapped = computed(() => {
  return _.map(termiElements.value, el => {
    const dataviite = el.getAttribute('data-viite');
    if (dataviite) {
      const termi: any = _.find(props.termit, { 'avain': dataviite });
      if (termi) {
        el.setAttribute('title', Kielet.kaanna(termi.termi));
        el.setAttribute('aria-label', Kielet.kaanna(termi.termi));
        return {
          el,
          termi,
        };
      }
    }
    return null;
  });
});

// Watch for valueFormatted changes
watch(valueFormatted, async (newVal) => {
  await nextTick(); // Wait for initial DOM updates'
  if (newVal && contentContainer.value) {
    // Termit
    termiElements.value = [];

    // Find abbr elements within the component's content
    const abbrs = contentContainer.value.querySelectorAll('abbr');

    if (abbrs && abbrs.length) {
      _.each(abbrs, abbr => {
        const termi = document.createElement('a');
        termi.setAttribute('class', 'termi');
        termi.setAttribute('href', 'javascript:void(0)');
        termi.setAttribute('data-viite', abbr.getAttribute('data-viite') || '');
        termi.textContent = abbr.textContent;
        abbr.parentNode!.replaceChild(termi, abbr);
        termiElements.value.push(termi);
      });
    }
  }
}, { immediate: true });

const termiAriaNakyviin = (termiAvain) => {
  nakyvatTermit.value.push(termiAvain);
};

const termiAriaPiiloon = (termiAvain) => {
  nakyvatTermit.value = _.filter(nakyvatTermit.value, t => t !== termiAvain);
};
</script>

<style lang="scss" scoped>
@import '@shared/styles/_mixins.scss';
@import '@shared/styles/_variables.scss';

.teksti {
  @include teksti-sisalto;
}

::v-deep .termi {
  text-decoration: dotted underline;
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  color: $link;
  cursor: help;

  @include focus;
}

</style>
