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

// Export frequently used global properties as individual utility functions
export const useKaanna = () => {
  return useGlobalProperties().$kaanna;
};

export const useAikaleimaSd = () => {
  return useGlobalProperties().$sd;
};

export const useLocale = (): ComputedRef<string> => {
  return useGlobalProperties().$locale;
};

export const useSisaltoKieli = (): ComputedRef<string> => {
  return useGlobalProperties().$slang;
};

export const useSuodatin = () => {
  return useGlobalProperties().$suodatin;
};

export const useFilterBy = () => {
  return useGlobalProperties().$filterBy;
};

export const useKaannaOlioTaiTeksti = () => {
  return useGlobalProperties().$kaannaOlioTaiTeksti;
};

export const useKaannaPlaceholder = () => {
  return useGlobalProperties().$kaannaPlaceholder;
};

export const useT = () => {
  return useGlobalProperties().$t;
};

// Direct usable exports of global properties
export const $kaanna = (...args: any[]) => {
  const kaanna = useKaanna();
  return kaanna ? kaanna(...args) : args[0];
};

export const $sd = (value: any) => {
  const sd = useAikaleimaSd();
  return sd ? sd(value) : value;
};

export const $suodatin = (query: string) => (value: any) => {
  const suodatin = useSuodatin();
  return suodatin ? suodatin(query)(value) : value;
};

export const $filterBy = (field: string, query: string) => (value: any) => {
  const filterBy = useFilterBy();
  return filterBy ? filterBy(field, query)(value) : true;
};

export const $kaannaOlioTaiTeksti = (...args: any[]) => {
  const kaannaOlioTaiTeksti = useKaannaOlioTaiTeksti();
  return kaannaOlioTaiTeksti ? kaannaOlioTaiTeksti(...args) : args[0];
};

export const $kaannaPlaceholder = (...args: any[]) => {
  const kaannaPlaceholder = useKaannaPlaceholder();
  return kaannaPlaceholder ? kaannaPlaceholder(...args) : args[0];
};

export const $t = (key: string, values?: Record<string, any>) => {
  const t = useT();
  return t ? t(key, values) : key;
};

// Getter functions for locale and content language
export const $locale = (): string => {
  const locale = useLocale();
  return locale?.value || 'fi';
};

export const $slang = (): string => {
  const slang = useSisaltoKieli();
  return slang?.value || 'fi';
};
