export interface KoulutustyyppiTaiTutkinto {
  type: string,
  object: any,
};

export interface KoulutustyyppiTaiTutkintoItem {
  text: string,
  value: KoulutustyyppiTaiTutkinto,
}

export const julkaisupaikkaSort = {
  'opintopolku_etusivu': 1,
  'ops': 2,
  'lops': 3,
  'amosaa': 4,
};

export const julkaisupaikka = Object.freeze({
  opintopolku_etusivu: 'opintopolku_etusivu',
  ops: 'ops',
  lops: 'lops',
  amosaa: 'amosaa',
});
