import { getCurrentInstance, ComputedRef } from 'vue';

// Store a reference to the app instance that can be set from main.ts
let _app: any = null;

/**
 * Set the application instance reference - call this in main.ts
 * @param app Vue app instance from createApp()
 */
export const setAppInstance = (app: any) => {
  _app = app;
};

/**
 * Get global properties either from component context or from app instance
 * @returns Object containing all global properties
 */
export const useGlobalProperties = (): Record<string, any> => {
  // Try to get from component context first (during setup)
  const instance = getCurrentInstance();
  if (instance) {
    return instance.appContext.config.globalProperties;
  }

  // Otherwise use the stored app instance
  if (_app) {
    return _app.config.globalProperties;
  }

  console.warn('Global properties are not available. Make sure to call setAppInstance in main.ts');
  return {};
};

// Direct usable exports of global properties
export const $kaanna = (...args: any[]) => {
  const kaanna = useGlobalProperties().$kaanna;
  return kaanna ? kaanna(...args) : args[0];
};

export const $sd = (value: any) => {
  const sd = useGlobalProperties().$sd;
  return sd ? sd(value) : value;
};

export const $sdt = (value: any) => {
  const sdt = useGlobalProperties().$sdt;
  return sdt ? sdt(value) : value;
};

export const $ldt = (value: any) => {
  const ldt = useGlobalProperties().$ldt;
  return ldt ? ldt(value) : value;
};

export const $ld = (value: any) => {
  const ld = useGlobalProperties().$ld;
  return ld ? ld(value) : value;
};

export const $suodatin = (query: string) => (value: any) => {
  const suodatin = useGlobalProperties().$suodatin;
  return suodatin ? suodatin(query)(value) : value;
};

export const $filterBy = (field: string, query: string) => (value: any) => {
  const filterBy = useGlobalProperties().$filterBy;
  return filterBy ? filterBy(field, query)(value) : true;
};

export const $kaannaOlioTaiTeksti = (...args: any[]) => {
  const kaannaOlioTaiTeksti = useGlobalProperties().$kaannaOlioTaiTeksti;
  return kaannaOlioTaiTeksti ? kaannaOlioTaiTeksti(...args) : args[0];
};

export const $kaannaPlaceholder = (...args: any[]) => {
  const kaannaPlaceholder = useGlobalProperties().$kaannaPlaceholder;
  return kaannaPlaceholder ? kaannaPlaceholder(...args) : args[0];
};

export const $t = (key: string, values?: Record<string, any>, options?: any) => {
  const t = useGlobalProperties().$t;
  return t ? t(key, values, options) : key;
};

// Getter functions for locale and content language
export const $locale = (): string => {
  const locale = useGlobalProperties().$locale;
  return locale?.value || 'fi';
};

export const $slang = (): string => {
  const slang = useGlobalProperties().$slang;
  return slang?.value || 'fi';
};

export const $success = (title: string): any => {
  return useGlobalProperties().$success(title);
}

export const $notification = (title: string): any => {
  return useGlobalProperties().$notification(title);
}

export const $info = (title: string): any => {
  return useGlobalProperties().$info(title);
}

export const $fail = (title: string): any => {
  return useGlobalProperties().$fail(title);
}

export const $warning = (title: string): any => {
  return useGlobalProperties().$warning(title);
}

export const $bvModal = (): any => {
  // TODO: Implement this

  // return useGlobalProperties().$bvModal;

  return {};
}
