import { v4 as genUuid } from 'uuid';

export function generateTemporaryKoodiUri(koodisto: string) {
  return 'temporary_' + koodisto + '_' + genUuid();
}

export enum Koodistot {
  AMMATTITAITOVAATIMUKSET = 'ammattitaitovaatimukset',
  TUTKINNONOSAT = 'tutkinnonosat',
  TUTKINTO = 'tutkinto',
  KOULUTUS = 'koulutus',
  TUTKINTONIMIKKEET = 'tutkintonimikkeet',
  AMMATILLISENOPPIAINEET = 'ammatillisenoppiaineet',
  OPPIAINEETJAOPPIMAARATLOPS2021 = 'oppiaineetjaoppimaaratlops2021',
  LAAJAALAINENOSAAMINENLOPS2021 = 'laajaalainenosaaminenlops2021',
  LAAJAALAINENOSAAMINENKOTO2022 = 'laajaalainenosaaminenkoto2022',
  MODUULIKOODISTOLOPS2021 = 'moduulikoodistolops2021',
  KIELIKOODISTO_OPETUSHALLINTO = 'kielikoodistoopetushallinto',
  OSAAMISTAVOITTEET = 'osaamistavoitteet',
  OPINTOKOKONAISUUSTAVOITTEET = 'opintokokonaisuustavoitteet',
  OPINTOKOKONAISUUSNIMET = 'opintokokonaisuusnimet',
  ARVIOINTIASTEIKKOAMMATILLINEN = 'arviointiasteikkoammatillinen15',
  OSAAMISALA = 'osaamisala',
  TAVOITESISALTOALUEENOTSIKKO = 'tavoitesisaltoalueenotsikko',
  TAVOITEALUEET = 'tavoitealueet',
  TAVOITTEETLUKUTAIDOT = 'tavoitteetlukutaidot',
  KOTOUTUMISKOULUTUSTAVOITTEET = 'kotoutumiskoulutustavoitteet',
  TUTKINTOKOULUTUKSEEN_VALMENTAVAKOULUTUS_LAAJAALAINENOSAAMINEN = 'tutkintokoulutukseenvalmentavakoulutuslaajaalainenosaaminen',
  KOULUTUKSENOSATTUVA = 'koulutuksenosattuva',
}
