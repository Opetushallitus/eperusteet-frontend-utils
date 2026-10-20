import _ from 'lodash';
import type { TiedoteDto } from '@shared/api/eperusteet';
import { $t, $sdt, $kaanna } from '@shared/utils/globals';

export interface KoulutustyyppiRyhmaValinta {
  type: string,
  object: string[],
}

export const julkaisupaikkaSort = {
  'opintopolku_etusivu': 1,
  'ops': 2,
  'lops': 3,
  'amosaa': 4,
  'vst': 5,
  'koto': 6,
};

export const julkaisupaikka = Object.freeze({
  opintopolku_etusivu: 'opintopolku_etusivu',
  ops: 'ops',
  lops: 'lops',
  amosaa: 'amosaa',
  vst: 'vst',
  tuva: 'tuva',
  koto: 'koto',
});

export function onkoUusi(aika) {
  const paiva = 1000 * 60 * 60 * 24;
  const paivaSitten = Date.now() - paiva;

  return aika > paivaSitten;
}

interface TiedoteTableOptions {
  sortable?: boolean;
  headerWidth?: string;
}

export function createTiedoteTableFields({
  sortable = true,
  headerWidth,
}: TiedoteTableOptions = {}) {
  const headerStyle = headerWidth
    ? { thStyle: { width: headerWidth } }
    : {};

  return [
    {
      key: 'luotu',
      label: $t('julkaistu'),
      sortable,
      formatter: (value: any) => $sdt(value),
    },
    {
      key: 'muokattu',
      label: $t('muokattu'),
      sortable,
      formatter: (value: any, _key: string, item: TiedoteDto) => {
        if (item.luotu !== item.muokattu) {
          return $sdt(value);
        }
        return '';
      },
    },
    {
      key: 'otsikko',
      label: $t('tiedotteen-otsikko'),
      sortable: false,
      ...headerStyle,
      formatter: (value: any) => $kaanna(value),
    },
    {
      key: 'julkaisupaikat',
      label: $t('tiedote-julkaistu'),
      sortable: false,
      ...headerStyle,
      formatter: (value: any, _key: string, item: TiedoteDto) => {
        return _.join(
          [
            ..._.chain(value)
              .sortBy((paikka) => julkaisupaikkaSort[paikka])
              .map((paikka) => $t('tiedote-julkaisupaikka-' + paikka))
              .value(),
            ..._.map(item.koulutustyypit, (kt) => $t(kt)),
          ],
          ', ',
        );
      },
    },
  ];
}
