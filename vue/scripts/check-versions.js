const fs = require('fs');

function main() {
    const package = JSON.parse(fs.readFileSync('package.json').toString('utf8'));
    const utilsPackage = JSON.parse(fs.readFileSync('eperusteet-frontend-utils/vue/package.json').toString('utf8'));

    for (const [name, version] of Object.entries(package.dependencies)) {
        const utilPackageVersion = utilsPackage.dependencies[name];
        if (utilPackageVersion && utilPackageVersion !== version) {
            console.log(`Fix ${name} version mismatch (${version} -> ${utilPackageVersion})`);
            process.exit(1);
        }
    }
}

main();
