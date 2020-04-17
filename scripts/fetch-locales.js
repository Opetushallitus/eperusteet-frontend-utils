// EP-2184
const axios = require('axios');
const fs = require('fs');

const categories = Object.freeze([
    {
        name: 'eperusteet',
        locales: [
            {
                name: 'fi',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-ui/master/src/translations/locale-fi.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet&locale=fi',
            },
            {
                name: 'sv',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-ui/master/src/translations/locale-sv.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet&locale=sv',
            },
            {
                name: 'en',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet&locale=en',
            },
        ]
    },
    {
        name: 'eperusteet-ylops',
        locales: [
            {
                name: 'fi',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-ylops-lukio/master/src/translations/locale-fi.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-ylops&locale=fi',
            },
            {
                name: 'sv',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-ylops-lukio/master/src/translations/locale-sv.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-ylops&locale=sv',
            },
            {
                name: 'en',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-ylops&locale=en',
            },
        ]
    },
    {
        name: 'eperusteet-opintopolku',
        locales: [
            {
                name: 'fi',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-opintopolku/master/eperusteet-opintopolku-app/v2/src/translations/locale-fi.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-opintopolku&locale=fi',
            },
            {
                name: 'sv',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-opintopolku/master/eperusteet-opintopolku-app/v2/src/translations/locale-sv.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-opintopolku&locale=sv',
            },
            {
                name: 'en',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-opintopolku&locale=en',
            },
        ]
    },
    {
        name: 'eperusteet-amosaa',
        locales: [
            {
                name: 'fi',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-amosaa/master/eperusteet-amosaa-app/src/localisation/locale-fi.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-amosaa&locale=fi',
            },
            {
                name: 'sv',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-amosaa/master/eperusteet-amosaa-app/src/localisation/locale-sv.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-amosaa&locale=sv',
            },
            {
                name: 'en',
                baseUrl: 'https://raw.githubusercontent.com/Opetushallitus/eperusteet-amosaa/master/eperusteet-amosaa-app/src/localisation/locale-en.json',
                url: 'https://virkailija.opintopolku.fi/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-amosaa&locale=en',
            },
        ]
    },
]);

async function fetch(url) {
    console.log(`Fetch: ${url}`);
    return (await axios.get(url, {
        headers: {
            'Caller-Id': '1.2.246.562.10.00000000001.eperusteet_scripts'
        },
    })).data;
}

async function main() {
    if (!fs.existsSync('translations')) {
        console.log('Create directory: translations');
        fs.mkdirSync('translations');
    }

    for (const category of categories) {
        for (const locale of category.locales) {

            console.log('');
            console.log(`-------------------- ${category.name} (${locale.name}) --------------------`);

            let localisation = {};

            // Fetch base translations
            if (locale.hasOwnProperty('baseUrl')) {
                localisation = await fetch(locale.baseUrl);
                console.log(`Fetched count: ${Object.keys(localisation).length}`);
            }

            // Fetch new translations
            if (locale.hasOwnProperty('url')) {
                const data = await fetch(locale.url);
                console.log(`Fetched count: ${data.length}`);

                for (const entry of data) {
                    localisation[entry.key] = entry.value;
                }
            }
            console.log(`Combined count: ${Object.keys(localisation).length}`);

            // Sorted and pretty JSON
            const json = JSON.stringify(localisation,
                Object.keys(localisation).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
                4);

            if (!fs.existsSync(`translations/${category.name}`)) {
                console.log(`Create directory: translations/${category.name}`);
                fs.mkdirSync(`translations/${category.name}`);
            }

            const filename = `translations/${category.name}/locale-${locale.name}.json`;
            console.log(`Write file: ${filename}`);

            fs.writeFileSync(filename, json, { encoding: 'utf8', flag: 'w' });

            console.log('');
        }
    }
}

main();
