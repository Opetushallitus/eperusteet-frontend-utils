import Vue from 'vue';
import { MuokkaustietoKayttajallaDto, PerusteenMuutostietoDto, Muokkaustiedot } from '@shared/api/eperusteet';
import _ from 'lodash';
import { reactive, computed } from 'vue';
import { computedValue } from '@shared/utils/interfaces';

export class MuokkaustietoStore {
  private state = reactive({
    muokkaustiedot: null as MuokkaustietoKayttajallaDto[] | null,
    viimeinenHaku: null as MuokkaustietoKayttajallaDto[] | null,
    perusteId: null as number | null,
    hakuLukumaara: 8 as number,
    muutostiedot: null as PerusteenMuutostietoDto[] | null,
  });

  async init(perusteId: number) {
    this.state.perusteId = perusteId;
    this.state.muokkaustiedot = null;
    await this.update();
  }

  public readonly muokkaustiedot = computedValue(() => this.state.muokkaustiedot);
  public readonly viimeinenHaku = computedValue(() => this.state.viimeinenHaku);
  public readonly hakuLukumaara = computedValue(() => this.state.hakuLukumaara);
  public readonly muutostiedot = computedValue(() => this.state.muutostiedot);

  public async update() {
    if (this.state.perusteId) {
      if (this.state.muokkaustiedot && !_.isEmpty(this.state.muokkaustiedot)) {
        this.state.viimeinenHaku = (await Muokkaustiedot.getPerusteenMuokkausTiedotWithLuomisaika(this.state.perusteId, (_.last(this.state.muokkaustiedot) as any).luotu, this.state.hakuLukumaara) as any).data;

        if (this.state.viimeinenHaku) {
          this.state.muokkaustiedot = [
            ...this.state.muokkaustiedot,
            ...this.state.viimeinenHaku,
          ];
        }
      }
      else {
        this.state.muokkaustiedot = (await Muokkaustiedot.getPerusteenMuokkausTiedotWithLuomisaika(this.state.perusteId, undefined, this.state.hakuLukumaara) as any).data;
      }
    }
  }

  public async getVersionMuutokset(perusteId, revision) {
    this.state.muutostiedot = (await Muokkaustiedot.getPerusteenVersionMuokkaustiedot(perusteId, revision) as any).data;
  }
}
