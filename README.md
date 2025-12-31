# ePerusteet-frontend-utils

[![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-frontend-utils.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-frontend-utils)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f782a4a50622ae34a2bd/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-frontend-utils/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/f782a4a50622ae34a2bd/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-frontend-utils/maintainability)

Käytetään ePerusteet-projekteissa:
* <https://github.com/Opetushallitus/eperusteet-ui>
* <https://github.com/Opetushallitus/eperusteet-ylops-ui>
* <https://github.com/Opetushallitus/eperusteet-amosaa-ui>
* <https://github.com/Opetushallitus/eperusteet-opintopolku>

Ympäristön pystytys ja käyttöönotto on kuvattu tarkemmin kunkin projektin yhteydessä.

## Projektin asentaminen

### Kehitysympäristön vaatimukset

```
Node.js 21
```

Projekti käyttää Yarn 4.9.2 pakettienhallintaan.

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

# Generoi rajapinnat eperusteet-backendista
yarn gen:api

# Generoi rajapinnat eperusteet-backendista
yarn gen:api:eperusteet

# Generoi rajapinnat ylops-backendista
yarn gen:api:ylops

```


## ePerusteet-projektit

  Projekti | Build status | Maintainability | Test Coverage | Known Vulnerabilities
  -------- | ------------ | --------------- | ------------- | ----------------------
  [ePerusteet](https://github.com/Opetushallitus/eperusteet) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet)
  [ePerusteet-amosaa](https://github.com/Opetushallitus/eperusteet-amosaa) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-amosaa.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-amosaa)
  [ePerusteet-ylops](https://github.com/Opetushallitus/eperusteet-ylops) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-ylops.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-ylops)
  [ePerusteet-ui](https://github.com/Opetushallitus/eperusteet-ui) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-ui) |  |  | 
  [eperusteet-ylops-ui](https://github.com/Opetushallitus/eperusteet-ylops-ui) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-ylops-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-ylops-ui) | [![Maintainability](https://api.codeclimate.com/v1/badges/eea9e59302df6e343d57/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-ylops-ui/maintainability) | [![Test Coverage](https://api.codeclimate.com/v1/badges/eea9e59302df6e343d57/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-ylops-ui/test_coverage) | 
  [ePerusteet-amosaa-ui](https://github.com/Opetushallitus/eperusteet-amosaa-ui) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-amosaa-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-amosaa-ui) |  |  | 
  [ePerusteet-opintopolku](https://github.com/Opetushallitus/eperusteet-opintopolku) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku) | [![Maintainability](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/maintainability) | [![Test Coverage](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/test_coverage)
  [ePerusteet-backend-utils](https://github.com/Opetushallitus/eperusteet-backend-utils) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-backend-utils.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-backend-utils)
  [ePerusteet-frontend-utils](https://github.com/Opetushallitus/eperusteet-frontend-utils) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-frontend-utils.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-frontend-utils) | [![Maintainability](https://api.codeclimate.com/v1/badges/f782a4a50622ae34a2bd/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-frontend-utils/maintainability) | [![Test Coverage](https://api.codeclimate.com/v1/badges/f782a4a50622ae34a2bd/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-frontend-utils/test_coverage)
