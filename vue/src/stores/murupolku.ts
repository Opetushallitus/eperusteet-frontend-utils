import { Getter, State, Store } from './store';
import Vue from 'vue';
import _ from 'lodash';
// import { Opetussuunnitelma } from './opetussuunnitelma';

@Store
class MurupolkuStore {
  @State()
  public polku: { [avain: string]: any } = {};

  @Getter()
  murut() {
    // const nimi = _.get(Opetussuunnitelma(), 'opetussuunnitelma.nimi');
    return {
      ...this.polku,
      // opetussuunnitelma: nimi,
    };
  }

  aseta(key: string, value: any) {
    this.polku = {
      ...this.polku,
      [key]: value,
    };
  }
}

export const Murupolku = new MurupolkuStore();
