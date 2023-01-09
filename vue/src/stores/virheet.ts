import { Store, Action, State } from './store';

export type ErrorHandler = (virhe: string) => Promise<void> | void;

@Store
class VirheStore {
  private onErrorHandlers: ErrorHandler[] = [];

  @State()
  private virheet: any = [];

  @Action()
  public async lisaaVirhe(virhe) {
    for (const handler of this.onErrorHandlers) {
      handler(virhe);
    }
  }

  public onError(handler: ErrorHandler) {
    this.onErrorHandlers.push(handler);
  }
}

export const Virheet = new VirheStore();
