import _ from 'lodash';

export interface ITermi {
  id?: number;
  avain?: string;
  termi?: { [key: string]: string; };
  selitys?: { [key: string]: string; };
  alaviite?: boolean;
}

export interface ITermiStore {
  getTermi: (avain: string) => any;
  getAllTermit: () => ITermi[];
  updateOrAddTermi?: (termi: ITermi) => Promise<any>;
  alaviiteSupported?: () => boolean;
}

export interface IKasiteHandler {
  /**
   * Hae yksi termi termin avainarvolla (UUID)
   */
  getOne: (avain: string) => ITermi,

  /**
   * Hae kaikki termit
   */
  getAll: () => ITermi[],

  /**
   * Lisää uusi termi tai päivitä termiä. Vanhaa päivitetään jos `avain` ja `id` löytyy.
   * Vapaaehtoinen - sovellukset jotka vain lukevat termejä eivät tarvitse tätä.
   */
  addOrUpdate?: (termi: ITermi) => Promise<ITermi>,
}

export function createKasiteHandler(store: ITermiStore): IKasiteHandler {
  const handler: IKasiteHandler = {
    getOne(avain: string) {
      return store.getTermi(avain);
    },
    getAll() {
      return store.getAllTermit();
    },
  };
  if (store.updateOrAddTermi) {
    handler.addOrUpdate = async (termi: ITermi) => (await store.updateOrAddTermi!(termi));
  }
  return handler;
}
