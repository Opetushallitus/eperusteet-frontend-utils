import type { DirectiveBinding, ObjectDirective } from 'vue';

/** Inset / stacking for `position: sticky` (strings are passed through, numbers become px). */
export interface StickyOptions {
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: string | number;
  /** When true, directive does not apply styles. */
  disabled?: boolean;
}

function inset(v: string | number | undefined): string | undefined {
  if (v === undefined || v === '') {
    return undefined;
  }
  if (typeof v === 'number') {
    return `${v}px`;
  }
  return v;
}

function clearStickyStyles(el: HTMLElement) {
  el.style.position = '';
  el.style.top = '';
  el.style.right = '';
  el.style.bottom = '';
  el.style.left = '';
  el.style.zIndex = '';
}

function isStickyOptions(v: unknown): v is StickyOptions {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function normalizeOptions(binding: DirectiveBinding<boolean | StickyOptions | undefined>): StickyOptions {
  const { value, modifiers } = binding;
  const opts: StickyOptions = isStickyOptions(value) ? { ...value } : {};

  if (modifiers.top) {
    opts.top = opts.top ?? 0;
  }
  if (modifiers.right) {
    opts.right = opts.right ?? 0;
  }
  if (modifiers.bottom) {
    opts.bottom = opts.bottom ?? 0;
  }
  if (modifiers.left) {
    opts.left = opts.left ?? 0;
  }

  const hasModifier = modifiers.top || modifiers.right || modifiers.bottom || modifiers.left;
  const hasInsetInOpts
    = opts.top !== undefined
    || opts.right !== undefined
    || opts.bottom !== undefined
    || opts.left !== undefined;

  // Sticky needs at least one inset; default top when only extras (e.g. zIndex) are passed.
  if (!hasModifier && !hasInsetInOpts) {
    opts.top = opts.top ?? 0;
  }

  return opts;
}

function apply(el: HTMLElement, binding: DirectiveBinding<boolean | StickyOptions | undefined>) {
  const value = binding.value;
  const disabled
    = value === false
      || (isStickyOptions(value) && value.disabled === true);

  if (disabled) {
    clearStickyStyles(el);
    return;
  }

  const opts = normalizeOptions(binding);

  el.style.position = 'sticky';

  const top = inset(opts.top);
  const right = inset(opts.right);
  const bottom = inset(opts.bottom);
  const left = inset(opts.left);
  const z = opts.zIndex;

  if (top !== undefined) {
    el.style.top = top;
  }
  else {
    el.style.removeProperty('top');
  }
  if (right !== undefined) {
    el.style.right = right;
  }
  else {
    el.style.removeProperty('right');
  }
  if (bottom !== undefined) {
    el.style.bottom = bottom;
  }
  else {
    el.style.removeProperty('bottom');
  }
  if (left !== undefined) {
    el.style.left = left;
  }
  else {
    el.style.removeProperty('left');
  }
  if (z !== undefined) {
    el.style.zIndex = String(z);
  }
  else {
    el.style.removeProperty('z-index');
  }
}

export const vSticky: ObjectDirective<HTMLElement, boolean | StickyOptions | undefined> = {
  mounted(el, binding) {
    apply(el, binding);
  },
  updated(el, binding) {
    apply(el, binding);
  },
  beforeUnmount(el) {
    clearStickyStyles(el);
  },
};
