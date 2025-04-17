import Vue from 'vue';
import { MuokkaustietoKayttajallaDto, PerusteenMuutostietoDto, Muokkaustiedot } from '@shared/api/eperusteet';
import _ from 'lodash';
import { ref } from 'vue';
import { computed } from 'vue';

export class MuokkaustietoStore {
  private state = ref({
    muokkaustiedot: null as MuokkaustietoKayttajallaDto[] | null,
    viimeinenHaku: null as MuokkaustietoKayttajallaDto[] | null,
    perusteId: null as number | null,
    hakuLukumaara: 8 as number,
    muutostiedot: null as PerusteenMuutostietoDto[] | null,
  });

  async init(perusteId: number) {
    this.state.value.perusteId = perusteId;
    this.state.value.muokkaustiedot = null;
    await this.update();
  }

  public readonly muokkaustiedot = computed(() => this.state.value.muokkaustiedot);
  public readonly viimeinenHaku = computed(() => this.state.value.viimeinenHaku);
  public readonly hakuLukumaara = computed(() => this.state.value.hakuLukumaara);
  public readonly muutostiedot = computed(() => this.state.value.muutostiedot);

  public async update() {
    if (this.state.value.perusteId) {
      if (this.state.value.muokkaustiedot && !_.isEmpty(this.state.value.muokkaustiedot)) {
        this.state.value.viimeinenHaku = (await Muokkaustiedot.getPerusteenMuokkausTiedotWithLuomisaika(this.state.value.perusteId, (_.last(this.state.value.muokkaustiedot) as any).luotu, this.state.value.hakuLukumaara) as any).data;

        if (this.state.value.viimeinenHaku) {
          this.state.value.muokkaustiedot = [
            ...this.state.value.muokkaustiedot,
            ...this.state.value.viimeinenHaku,
          ];
        }
      }
      else {
        this.state.value.muokkaustiedot = (await Muokkaustiedot.getPerusteenMuokkausTiedotWithLuomisaika(this.state.value.perusteId, undefined, this.state.value.hakuLukumaara) as any).data;
      }
    }
  }

  public async getVersionMuutokset(perusteId, revision) {
    this.state.value.muutostiedot = (await Muokkaustiedot.getPerusteenVersionMuokkaustiedot(perusteId, revision) as any).data;
  }
}
