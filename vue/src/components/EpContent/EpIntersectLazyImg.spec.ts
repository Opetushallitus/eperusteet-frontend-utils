import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EpIntersectLazyImg from './EpIntersectLazyImg.vue';

let lastIoCallback: IntersectionObserverCallback | undefined;
let lastIoInit: IntersectionObserverInit | undefined;

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => [] as IntersectionObserverEntry[]);
  root: Element | null = null;
  rootMargin = '';
  thresholds: readonly number[] = [];

  constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    lastIoCallback = cb;
    lastIoInit = options;
  }
}

describe('EpIntersectLazyImg', () => {
  const realSrc = 'https://example.test/api/kuvat/preview-uuid';

  beforeEach(() => {
    lastIoCallback = undefined;
    lastIoInit = undefined;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with inline SVG placeholder src, not the real URL', async () => {
    const wrapper = mount(EpIntersectLazyImg, {
      props: { src: realSrc },
      attachTo: document.body,
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toMatch(/^data:image\/svg\+xml,/);
    expect(img.attributes('src')).not.toContain('example.test');

    wrapper.unmount();
  });

  it('sets real src after IntersectionObserver reports intersecting', async () => {
    const wrapper = mount(EpIntersectLazyImg, {
      props: { src: realSrc },
      attachTo: document.body,
    });

    expect(lastIoCallback).toBeDefined();
    const imgEl = wrapper.find('img').element;

    const entry = {
      isIntersecting: true,
      target: imgEl,
    } as unknown as IntersectionObserverEntry;

    lastIoCallback!([entry], {} as IntersectionObserver);

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('img').attributes('src')).toBe(realSrc);

    wrapper.unmount();
  });

  it('uses .imageselector as observer root when inside vue-select menu', async () => {
    const menu = document.createElement('div');
    menu.className = 'imageselector';
    document.body.appendChild(menu);

    const wrapper = mount(EpIntersectLazyImg, {
      props: { src: realSrc },
      attachTo: menu,
    });

    expect(lastIoInit?.root).toBe(menu);

    wrapper.unmount();
    menu.remove();
  });

  it('passes imgClass to the img element', () => {
    const wrapper = mount(EpIntersectLazyImg, {
      props: { src: realSrc, imgClass: 'preview' },
      attachTo: document.body,
    });

    expect(wrapper.find('img').classes()).toContain('preview');

    wrapper.unmount();
  });

  it('uses real src when IntersectionObserver is missing from window', async () => {
    vi.unstubAllGlobals();
    const had = 'IntersectionObserver' in window;
    const previous = had ? (window as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver : undefined;
    try {
      if (had) {
        Reflect.deleteProperty(window, 'IntersectionObserver' as never);
      }
      expect('IntersectionObserver' in window).toBe(false);

      const wrapper = mount(EpIntersectLazyImg, {
        props: { src: realSrc },
        attachTo: document.body,
      });
      await flushPromises();
      expect(wrapper.find('img').attributes('src')).toBe(realSrc);
      wrapper.unmount();
    }
    finally {
      if (previous !== undefined) {
        (window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = previous;
      }
    }
  });
});
