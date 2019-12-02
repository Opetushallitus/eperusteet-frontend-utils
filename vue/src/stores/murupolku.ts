import { Getter, State, Store } from './store';

@Store
class MurupolkuStore {
  @State()
  public polku: { [avain: string]: any } = {};

  @Getter((state, getters) => {})
  murut() {
    return {
      ...this.polku,
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
