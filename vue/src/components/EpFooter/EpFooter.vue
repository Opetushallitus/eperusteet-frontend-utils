<template>
<footer>
  <div class="footer-content link-style">
    <div class="row">
      <div class="col-lg col-slot">
        <img src="@assets/img/banners/oph_logo.svg" slot="footer-logo" :alt="$t('oph')" />
      </div>
      <div class="col-md col-slot">
        <p class="linkki-kuvaus">{{ $t('opetushallitus') }}</p>
        <ep-linkki :url="$kaanna(linkit.oph)" icon="launch"></ep-linkki>
      </div>
      <div class="col-md col-slot">
        <p class="linkki-kuvaus">{{ $t('opintopolku') }}</p>
        <ep-linkki :url="$kaanna(linkit.opintopolku)" icon="launch"></ep-linkki>
      </div>
      <div class="col-md col-slot">
        <p class="linkki-kuvaus">{{ $t('eperusteet') }}</p>
        <ep-linkki :url="$kaanna(linkit.eperusteet)" icon="launch"></ep-linkki>
      </div>
      <div class="col-md col-slot">
        <slot name="palaute" />
        <div class="d-flex link-style">
          <EpMaterialIcon>chevron_right</EpMaterialIcon>
          <EpExternalLink :url="$kaanna(linkit.yhteystiedot)" :showIcon="false">
            {{ $t('yhteystiedot') }}: {{ yhteystiedotMail }}</EpExternalLink>
        </div>
        <div class="d-flex link-style">
          <EpMaterialIcon>chevron_right</EpMaterialIcon>
          <EpExternalLink :url="$kaanna(linkit.seloste)" :showIcon="false">
            {{ $t('tietosuojaseloste') }}
          </EpExternalLink>
        </div>
      </div>
    </div>
  </div>
</footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';

@Component({
  name: 'EpFooter',
  components: {
    EpLinkki,
  },
})
export default class EpFooter extends Vue {
  get linkit() {
    return {
      oph: {
        fi: 'https://www.oph.fi/fi',
        sv: 'https://www.oph.fi/sv',
      },
      opintopolku: {
        fi: 'https://opintopolku.fi/konfo/fi',
        sv: 'https://opintopolku.fi/konfo/sv',
      },
      eperusteet: {
        fi: 'https://eperusteet.opintopolku.fi/#/fi',
        sv: 'https://eperusteet.opintopolku.fi/#/sv',
      },
      seloste: {
        fi: 'https://opintopolku.fi/konfo/fi/sivu/tietosuojaselosteet-ja-evasteet',
        sv: 'https://opintopolku.fi/konfo/sv/sivu/dataskyddsbeskrivningar-och-webbkakor',
      },
      yhteystiedot: {
        fi: 'mailto:' + this.yhteystiedotMail,
        sv: 'mailto:' + this.yhteystiedotMail,
      },
    };
  }

  get yhteystiedotMail() {
    return 'eperusteet@opintopolku.fi';
  }
}
</script>

<style scoped lang="scss">
footer {
  border-top: 1px solid #ccc;
  padding: 0;
  hyphens: none;

  img {
    width: 200px;
  }

  .footer-content {
    max-width: 90%;
    margin: 0 auto;
    padding: 20px 0;

    .row {
      align-items: center;
      .col-slot {
        padding: 16px;
        p {
          margin: 0;
          font-weight: 600;
        }
      }
    }

  }
}

</style>
