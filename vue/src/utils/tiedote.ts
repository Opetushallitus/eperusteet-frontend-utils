export interface KoulutustyyppiTaiTutkinto {
  type: string,
  object: any,
};

export interface KoulutustyyppiTaiTutkintoItem {
  text: string,
  value: KoulutustyyppiTaiTutkinto,
}

export const julkaisupaikkaSort = {
  'opintopolku': 1,
  'ops': 2,
  'lops': 3,
  'amosaa': 4,
};
