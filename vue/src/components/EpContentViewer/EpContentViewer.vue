<template>
<div v-if="valueFormatted">
  <div class="teksti" v-html="valueFormatted" />
  <div v-for="(viite, idx) in termitWrapped" :key="idx">
    <template v-if="viite">
      <b-popover v-if="viite.el && viite.termi"
                 :target="viite.el"
                 triggers="click blur"
                 placement="bottom"
                 @shown="termiAriaNakyviin(viite.termi.avain)"
                 @hidden="termiAriaPiiloon(viite.termi.avain)">
        <template v-slot:title v-if="viite.termi.selitys">
          {{ $kaanna(viite.termi.termi) }}
        </template>
        <div v-if="!viite.termi.selitys">{{ $kaanna(viite.termi.termi) }}</div>
        <div v-if="viite.termi.selitys" v-html="$kaanna(viite.termi.selitys)"></div>
      </b-popover>
      <div class="sr-only" aria-live="polite">
        <span v-if="nakyvatTermit.includes(viite.termi.avain)">
          {{ $kaanna(viite.termi.selitys) }}
        </span>
      </div>
    </template>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch, InjectReactive } from 'vue-property-decorator';
import { LiiteDtoWrapper } from '../../tyypit';
import { Kielet } from '../../stores/kieli';
import { ILinkkiHandler } from '../EpContent/LinkkiHandler';
import { RawLocation } from 'vue-router';

@Component
export default class EpContentViewer extends Vue {
  @Prop({ required: false, type: String })
  private value!: string; // Käännetty versio

  @Prop({ required: false, type: Array })
  private termit!: any[];

  @Prop({ required: false, type: Array })
  private kuvat!: LiiteDtoWrapper[];

  @InjectReactive('linkkiHandler')
  private linkkiHandler!: ILinkkiHandler;

  private termiElements: Element[] = [];
  private nakyvatTermit: string[] = [];

  get valueFormatted() {
    if (this.value) {
      const template = document.createElement('template');
      template.innerHTML = this.value;

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

        const kuva = _.find(this.kuvat, { id: datauid }) as LiiteDtoWrapper;

        const id = _.get(this.$route, 'params.toteutussuunnitelmaId');
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
            img.setAttribute('alt', this.$t('kuvituskuva') as string);
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
        if (routeNode && this.linkkiHandler) {
          const newLocation = this.$router.resolve(this.linkkiHandler.nodeToRoute(JSON.parse(routeNode)) as RawLocation);
          if (newLocation) {
            link.setAttribute('href', newLocation.href);
            link.removeAttribute('target');
            link.removeAttribute('rel');
          }
        }
      });

      return template.innerHTML;
    }
  }

  get termitWrapped() {
    return _.map(this.termiElements, el => {
      const dataviite = el.getAttribute('data-viite');
      if (dataviite) {
        const termi: any = _.find(this.termit, { 'avain': dataviite });
        if (termi) {
          el.setAttribute('title', Kielet.kaanna(termi.termi));
          el.setAttribute('aria-label', Kielet.kaanna(termi.termi));
          return {
            el,
            termi,
          };
        }
      }
    });
  }

  @Watch('valueFormatted', { immediate: true })
  async onValueChanged(newVal) {
    await this.$nextTick(); // Odotetaan DOM-elementtien rendausta
    if (newVal) {
      // Termit
      this.termiElements = [];
      const abbrs = this.$el.querySelectorAll('abbr');
      _.each(abbrs, abbr => {
        const termi = document.createElement('a');
        termi.setAttribute('class', 'termi');
        termi.setAttribute('href', 'javascript:void(0)');
        termi.setAttribute('data-viite', abbr.getAttribute('data-viite') || '');
        termi.textContent = abbr.textContent;
        abbr.parentNode!.replaceChild(termi, abbr);
        this.termiElements.push(termi);
      });
    }
  }

  termiAriaNakyviin(termiAvain) {
    this.nakyvatTermit.push(termiAvain);
  }

  termiAriaPiiloon(termiAvain) {
    this.nakyvatTermit = _.filter(this.nakyvatTermit, t => t !== termiAvain);
  }
}
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
