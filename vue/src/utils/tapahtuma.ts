const oletusKohdereititys = {
  viite: 'tekstikappale',
  opetussuunnitelma: 'opsTiedot',
  opetussuunnitelma_rakenne: 'jarjesta',
  poppiaine: 'paikallinenOppiaine',
  opintojakso: 'opintojakso',
  termi: 'opsKasitteet',
};

const perusteKohdeReititys = {
  termi: 'kasitteet',
  kvliite: 'kvliite',
  tutkinnonosa: 'tutkinnonosa',
  tekstikappale: 'tekstikappale',
  osaalue: 'osaalue',
  tutkinnon_muodostuminen: 'muodostuminen',
  koulutuksenosa: 'koulutuksenosa',
};

const opasKohdeReititys = {
  termi: 'opasKasitteet',
};

const tyypitettyReititys = {
  'ops': { ...oletusKohdereititys },
  'normaali': { ...oletusKohdereititys, ...perusteKohdeReititys },
  'pohja': { ...oletusKohdereititys, ...perusteKohdeReititys },
  'opas': { ...oletusKohdereititys, ...opasKohdeReititys },
};

const kohdereititysId = {
  viite: 'osaId',
  poppiaine: 'paikallinenOppiaineId',
  opintojakso: 'opintojaksoId',
};

const perusteKohdereititysId = {
  viite: 'tekstiKappaleId',
  tutkinnonosa: 'tutkinnonOsaId',
  tekstikappale: 'tekstiKappaleId',
  osaalue: 'osaalueId',
  koulutuksenosa: 'koulutuksenosaId',
};

const tyypitettyKohdereititysId = {
  'ops': { ...kohdereititysId },
  'normaali': { ...kohdereititysId, ...perusteKohdereititysId },
  'pohja': { ...kohdereititysId, ...perusteKohdereititysId },
  'opas': { ...kohdereititysId, ...perusteKohdereititysId },
};

const kohdeIcon = {
  viite: 'kyna',
  opetussuunnitelma: 'opetussuunnitelma',
  opetussuunnitelma_rakenne: 'jarjesta',
  termi: 'kasitteet',
  kommentti: 'kommentti',
};

const tapahtumaIcon = {
  paivitys: 'kyna',
  luonti: 'plussa',
  poisto: 'roskalaatikko',
  palautus: 'peruuta',
  julkaisu: 'julkaisu',
  jarjestetty: 'jarjesta',
};

const poistetutTabIndices = {
  opintojakso: 0,
  poppiaine: 1,
  viite: 2,
};

export function muokkaustietoRoute(id, kohde, tapahtuma, tyyppi = 'ops') {
  if (tapahtuma === 'poisto') {
    return {
      name: 'opsPoistetut',
      params: {
        tabIndex: poistetutTabIndices[kohde],
      },
    };
  }

  const tyypinReititys = tyypitettyReititys[tyyppi] || tyypitettyReititys['ops'];
  const tyypinKohdereititysId = tyypitettyKohdereititysId[tyyppi] || tyypitettyKohdereititysId['ops'];

  const router = {
    name: tyypinReititys[kohde],
    params: {},
  };

  if (tyypinKohdereititysId[kohde]) {
    router.params[tyypinKohdereititysId[kohde]] = id;
  }

  return router;
}

export function muokkaustietoIcon(kohde, tapahtuma) {
  if (kohde === 'kommentti' || kohde === 'opetussuunnitelma_rakenne') {
    return kohdeIcon[kohde];
  }

  return tapahtumaIcon[tapahtuma] ? tapahtumaIcon[tapahtuma] : 'kysymysmerkki';
}
