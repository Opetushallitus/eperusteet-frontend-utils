export const ENV_PREFIX = import.meta.env.NODE_ENV === 'production' ? '' : 'https://eperusteet.opintopolku.fi';

export const DEFAULT_DRAGGABLE_PROPERTIES = {
  animation: 300,
  handle: '.order-handle',
  ghostClass: 'dragged',
};
