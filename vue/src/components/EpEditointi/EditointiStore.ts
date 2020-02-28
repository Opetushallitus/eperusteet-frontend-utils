import * as _ from 'lodash';
import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import { reactive, computed } from '@vue/composition-api';
import { Revision } from '@shared/tyypit';
import VueRouter from 'vue-router';
// import { fail } from '@/utils/notifications';
import { createLogger } from '@shared/utils/logger';

interface EditointiKontrolliFeatures {
  removal: boolean;
  validation: boolean;
  history: boolean;
  restore: boolean;
  preview: boolean;
}

export interface EditointiKontrolliHistory {
  revisions: (data) => Promise<Revision[]>;
  restore?: (data, rev: number) => Promise<void>;
}

export interface EditointiKontrolliValidation {
  valid: boolean;
  message?: string;
}

export interface EditointiKontrolliData {
  load: () => Promise<unknown>;
  save?: (data: any) => Promise<any>;
  cancel?: () => Promise<void>;
}

export interface EditointiKontrolliLocks {
  acquire: () => Promise<boolean>;
  release: () => Promise<void>;
}

export interface EditointiKontrolliConfig {
  editAfterLoad?: () => Promise<boolean>;
  source: EditointiKontrolliData;
  locks?: EditointiKontrolliLocks;
  history?: EditointiKontrolliHistory;
  start?: () => Promise<void>;
  remove?: (data: any) => Promise<void>;
  validate?: (data: any) => Promise<EditointiKontrolliValidation>;
  preview?: () => Promise<void>;
}

export interface EditointiKontrolliRestore {
  numero: number;
  modal?: any;
  routePushLatest?: boolean;
}

const DefaultConfig = {
  start: async () => {},
  remove: async () => {},
  validate: async () => ({
    valid: true
  }),
};

export interface EditointiStoreConfig {
  router: VueRouter;
}


export class EditointiStore {
  private static allEditingEditors: EditointiStore[] = [];
  private static router: VueRouter;
  private logger = createLogger(EditointiStore);

  public static install(
    vue: typeof Vue,
    config: EditointiStoreConfig,
) {
    EditointiStore.router = config.router;
  }

  private readonly features: EditointiKontrolliFeatures;
  private readonly state = reactive({
    data: null as any | null,
    revisions: [] as Revision[],
    backup: null as string | null,
    disabled: true,
    isSaving: false,
    isEditingState: false,
    isRemoved: false,
    isNew: false,
  });

  public static anyEditing() {
    return EditointiStore.allEditingEditors.length > 0;
  }

  public static async cancelAll() {
    for(const editor of EditointiStore.allEditingEditors) {
      await editor.cancel(true);
    }
  }

  public constructor(
    private config: EditointiKontrolliConfig,
  ) {
    this.features = {
      removal: !!config.remove,
      validation: !!config.validate,
      history: !!config.history,
      restore: !!config.history && !!config.history.restore,
      preview: !!config.preview,
    };

    this.logger.debug('Initing editointikontrollit with: ', _.keys(config));
    this.config = {
      ...DefaultConfig,
      ...config,
    };
  }

  public get hooks() {
    return this.config;
  }

  public get getFeatures() {
    return this.features;
  }

  public get isEditable() {
    return !!(this.config.source.save);
  }

  public readonly data = computed(() => this.state.data);
  public readonly revisions = computed(() => this.state.revisions);
  public readonly backup = computed(() => this.state.backup);
  public readonly disabled = computed(() => this.state.disabled);
  public readonly isSaving = computed(() => this.state.isSaving);
  public readonly isEditing = computed(() => this.state.isEditingState);
  public readonly isRemoved = computed(() => this.state.isRemoved);
  public readonly isNew = computed(() => this.state.isNew);

  public async init() {
    this.state.isNew = !!(this.config.editAfterLoad && await this.config.editAfterLoad());
    const data = await this.fetch();
    if (this.config.history && this.config.history.revisions) {
      this.state.revisions = await this.config.history.revisions(data);
    }
    this.logger.debug('Haetaan data', data);
    this.state.backup = JSON.stringify(data);
    this.state.data = data;
    this.state.disabled = false;
    if (this.state.isNew) {
      await this.start();
    }
  }

  public async start() {
    this.state.disabled = true;
    if (this.isEditing) {
      this.logger.warn('Editointi jo käynnissä');
      this.state.disabled = false;
      return;
    }

    if (this.state.isRemoved) {
      this.logger.warn('Poistettua resurssia ei voi editoida');
      this.state.disabled = false;
      return;
    }

    try {
      this.logger.debug('Aloitetaan editointi');
      if (!this.state.isNew) {
        await this.init();
      }
      if (this.config.start) {
        await this.config.start();
      }
      this.state.isEditingState = true;
      EditointiStore.allEditingEditors = [
        ...EditointiStore.allEditingEditors,
        this
      ];
    }
    catch (err) {
      this.logger.error('Editoinnin aloitus epäonnistui:', err);
    }
    finally {
      this.state.disabled = false;

      const navbar = document.getElementById('navigation-bar');
      const navbarHeight = navbar ? (-1 * navbar.getBoundingClientRect().height) : 0;
      const target = document.getElementById('scroll-anchor');
      if (target) {
        VueScrollTo.scrollTo('#scroll-anchor', {
          offset: navbarHeight,
          x: false,
          y: true,
        });
      }
    }
  }

  public async cancel(skipRedirectBack?) {
    this.state.disabled = true;
    if (!this.isEditing) {
      this.logger.warn('Ei voi perua');
      return;
    }

    this.logger.debug('Perutaan editointi');
    if (this.config.source.cancel) {
      await this.config.source.cancel!();
    }

    if (this.state.backup) {
      this.state.data = JSON.parse(this.state.backup);
    }
    // this.config.setData!(JSON.parse(this.state.backup));
    this.state.isEditingState = false;
    _.remove(EditointiStore.allEditingEditors, (editor) => editor == this);
    this.state.disabled = false;

    if (this.state.isNew && !skipRedirectBack) {
      EditointiStore.router.go(-1);
    }
  }

  public async validate() {
    const validation = await this.config.validate!(this.state.data);
    this.logger.debug('Validointi:', validation);
    return validation;
  }

  public async remove() {
    this.state.disabled = true;
    this.state.isEditingState = false;
    _.remove(EditointiStore.allEditingEditors, (editor) => editor == this);
    try {
      await this.config.remove!(this.state.data);
      this.logger.debug('Poistettu');
      this.state.isRemoved = true;
    }
    catch (err) {
      const syy = _.get(err, 'response.data.syy');
      if (syy) {
        // fail('poisto-epaonnistui', err.response.data.syy);
      }
      else {
        this.logger.error('poisto-epaonnistui', err);
        // fail('poisto-epaonnistui');
      }
      this.state.isRemoved = false;
    }
    this.state.disabled = false;
  }

  public async save() {
    this.state.disabled = true;
    this.state.isSaving = true;

    const validation = await this.validate();

    if (!this.isEditing) {
      this.logger.warn('Ei voi tallentaa ilman editointia');
    }
    else if(!validation.valid) {
      this.logger.debug('Validointi epäonnistui');
      // fail(validation.message ? validation.message : 'validointi-epaonnistui');
    }
    else if (!!(this.config.source.save)) {
      try {
        const after = await this.config.source.save(this.state.data);
        this.logger.success('Tallennettu onnistuneesti');
        await this.fetchRevisions();
        await this.init();
        this.state.isEditingState = false;
        _.remove(EditointiStore.allEditingEditors, (editor) => editor == this);
        if (after && _.isFunction(after)) {
          await after();
        }
      }
      catch (err) {
        // fail('tallennus-epaonnistui', err.response.data.syy);
        this.state.isEditingState = true;
      }
    }
    else {
      this.logger.debug('Tallentaminen ei mahdollista');
    }
    this.state.disabled = false;
    this.state.isSaving = false;
  }

  public async restore(event: EditointiKontrolliRestore) {
    try {
      await this.config.history!.restore!(this.state.data, event.numero);
      this.logger.success('Palautettu onnistuneesti');

      // Piilotetaan modaali
      if (event.modal && _.isFunction(event.modal.hide)) {
        event.modal.hide();
      }

      // Päivitetään näkymä uusimpaan
      if (event.routePushLatest) {
        await EditointiStore.router.push({ query: {} });
      }

      const data = await this.fetch();
      await this.fetchRevisions();
      this.state.backup = JSON.stringify(data);
      this.state.data = data;
    }
    catch (err) {
      const syy = _.get(err, 'response.data.syy');
      if (syy) {
        // fail('palautus-epaonnistui', err.response.data.syy);
      }
      else {
        this.logger.error('Palautus epäonnistui', err);
        // fail('palautus-epaonnistui');
      }
    }
  }

  private async fetchRevisions() {
    if (this.config.history && this.config.history.revisions) {
      this.state.revisions = await this.config.history.revisions(this.state.data);
    }
  }

  private async fetch() {
    const data = await this.config.source.load();
    if (_.isObject(data) || _.isArray(data)) {
      return JSON.parse(JSON.stringify(data));
    }
    else {
      throw new Error('Source must be an object or an array');
    }
  }
}

export function editointi(config: EditointiKontrolliConfig) {
  return new EditointiStore(config);
}
