// EP-2184
const fs = require('fs');
const process = require('process');

const translationDir = 'translations';
const translationMergerdDir = 'translations-merged';
const locales = ['fi', 'sv', 'en'];

async function main() {
    if (!fs.existsSync(translationMergerdDir)) {
        console.log(`Create directory: ${translationMergerdDir}`);
        fs.mkdirSync(translationMergerdDir);
    }
    const services = fs.readdirSync(translationDir, { encoding: 'utf8' });
    if (services.length < 1) {
        console.error('Didn\'t find any locale dir. Run fetch-locales script first.');
        process.exit(1);
    } else {
        console.log(`Locale count: ${services.length}`);
    }

    for (const locale of locales) {
        const merged = {};
        for (const service of services) {
            const file = fs.readFileSync(`${translationDir}/${service}/locale-${locale}.json`, 'utf8');
            const json = JSON.parse(file);
            for (const key of Object.keys(json)) {
                merged[key] = json[key];
            }
        }

        // Sorted and pretty JSON
        const json = JSON.stringify(merged,
            Object.keys(merged).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
            4);

        const filename = `translations-merged/locale-${locale}.json`;
        console.log(`Write file: ${filename}`);

        fs.writeFileSync(filename, json, { encoding: 'utf8', flag: 'w' });
    }
}

main();
