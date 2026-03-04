// tests/unit.setup.ts
import { config } from '@vue/test-utils';

// Mocks for PrimeVue and other components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

config.global.mocks = {
  // $t: tKey => tKey,
  // $sd: tKey => tKey,
  $kaannaPlaceholder: tKey => tKey,
  $kaanna: x => x ? x.fi : 'kaanna',
  $t: (tKey) => tKey,
  $sd: (tKey) => tKey,
  $kaannaOlioTaiTeksti: (tKey) => tKey,
};
