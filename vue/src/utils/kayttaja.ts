export interface IEsitysnimi {
  kutsumanimi?: string;
  sukunimi?: string;
  oidHenkilo?: string;
  muokkaajaOid?: string;
}

export function parsiEsitysnimi(tiedot: IEsitysnimi): string {
  if (tiedot.kutsumanimi && tiedot.sukunimi) {
    return tiedot.kutsumanimi + ' ' + tiedot.sukunimi;
  }
  else {
    return tiedot.oidHenkilo || tiedot.muokkaajaOid || '';
  }
}

