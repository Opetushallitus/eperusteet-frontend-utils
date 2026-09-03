# ePerusteet-frontend-utils

[![Build Status](https://github.com/Opetushallitus/eperusteet-frontend-utils/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-frontend-utils/actions/workflows/build.yml)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f782a4a50622ae34a2bd/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-frontend-utils/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/f782a4a50622ae34a2bd/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-frontend-utils/maintainability)

Jaettu Vue 3 -komponentti- ja apukirjasto ePerusteet-sovelluksille. Käyttöliittymäkomponenteissa **PrimeVue 4**, tyyleissä **Tailwind CSS v4** ja **SCSS**, testeissä **Vitest**.

Käytetään ePerusteet-projekteissa:
* <https://github.com/Opetushallitus/eperusteet-ui>
* <https://github.com/Opetushallitus/eperusteet-ylops-ui>
* <https://github.com/Opetushallitus/eperusteet-amosaa-ui>
* <https://github.com/Opetushallitus/eperusteet-opintopolku>

Ympäristön pystytys ja käyttöönotto on kuvattu tarkemmin kunkin projektin yhteydessä.

## Projektin asentaminen

### Kehitysympäristön vaatimukset

Asenna haluamallasi tavalla (esim. [nvm](https://github.com/nvm-sh/nvm)) `Node.js 24`.

Pakettienhallintaan käytetään **Yarn 4** (määritelty `vue/package.json`:n `packageManager`-kentässä). Käytä Corepackia:

```bash
corepack enable
```

Sen jälkeen `yarn install` hakemistossa `vue` käyttää oikeaa Yarn-versiota.

### Riippuvuuksien asentaminen

```sh
cd vue
yarn install
```

### Testaaminen

Projekti käyttää Vitest-testauskirjastoa.

```sh
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with UI
yarn test --ui
```

### Lähdekoodin analysoiminen

```sh
yarn lint

# Korjaus automaattisesti
yarn lint --fix
```

### API-rajapintojen generointi

```sh
# Generoi rajapinnat kaikista backendeistä (eperusteet, ylops, amosaa)
yarn gen:api

# Generoi rajapinnat eperusteet-backendista
yarn gen:api:eperusteet

# Generoi rajapinnat ylops-backendista
yarn gen:api:ylops
```

Oletuksena generointi käyttää julkaistuja OpenAPI-kuvauksia. Voit ohittaa ne ympäristömuuttujilla `EPERUSTEET_SPECFILE`, `EPERUSTEET_YLOPS_SPECFILE` ja `EPERUSTEET_AMOSAA_SPECFILE` (ks. `vue/scripts/buildapi.sh`).

## Cursor Agent Skills

Jaetut Agent Skills -tiedostot ylläpidetään tässä repossa polussa `.agents/skills/`.
Käyttävä sovellus linkittää ne automaattisesti `postinstall`-vaiheessa:

```json
"postinstall": "node eperusteet-frontend-utils/scripts/link-agent-skills.mjs"
```

Sovelluskohtaiset skillit voidaan lisätä `.agents/skills/`-kansioon linkitettyjen rinnalle.
Linkit luodaan paikallisesti, joten `.agents/` kannattaa pitää sovelluksen `.gitignore`-tiedostossa.

## ePerusteet-projektit

|Projekti | Build status |
|-----|-----|
|[ePerusteet](https://github.com/Opetushallitus/eperusteet)|[![Build Status](https://github.com/Opetushallitus/eperusteet/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet/actions)|
|[ePerusteet-amosaa](https://github.com/Opetushallitus/eperusteet-amosaa) | [![Build Status](https://github.com/Opetushallitus/eperusteet-amosaa/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-amosaa/actions)|
|[ePerusteet-ylops](https://github.com/Opetushallitus/eperusteet-ylops) | [![Build Status](https://github.com/Opetushallitus/eperusteet-ylops/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-ylops/actions)|
|[ePerusteet-ui](https://github.com/Opetushallitus/eperusteet-ui) | [![Build Status](https://github.com/Opetushallitus/eperusteet-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-ui/actions)|
|[eperusteet-ylops-ui](https://github.com/Opetushallitus/eperusteet-ylops-ui) | [![Build Status](https://github.com/Opetushallitus/eperusteet-ylops-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-ylops-ui/actions) |
|[ePerusteet-amosaa-ui](https://github.com/Opetushallitus/eperusteet-amosaa-ui) | [![Build Status](https://github.com/Opetushallitus/eperusteet-amosaa-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-amosaa-ui/actions)|
|[ePerusteet-opintopolku](https://github.com/Opetushallitus/eperusteet-opintopolku) | [![Build Status](https://github.com/Opetushallitus/eperusteet-opintopolku/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-opintopolku/actions) |
|[ePerusteet-backend-utils](https://github.com/Opetushallitus/eperusteet-backend-utils) | [![Build Status](https://github.com/Opetushallitus/eperusteet-backend-utils/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-backend-utils/actions)|
|[ePerusteet-frontend-utils](https://github.com/Opetushallitus/eperusteet-frontend-utils) | [![Build Status](https://github.com/Opetushallitus/eperusteet-frontend-utils/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-frontend-utils/actions) |
|[ePerusteet-pdf](https://github.com/Opetushallitus/eperusteet-pdf) | [![Build Status](https://github.com/Opetushallitus/eperusteet-pdf/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-pdf/actions) |
|[eperusteet-e2e-smoke-test](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test) | [![Build Status](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test/actions/workflows/playwright.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test/actions)|
