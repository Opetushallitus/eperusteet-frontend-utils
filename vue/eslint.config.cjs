const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const { lintModuleConfig } = require('./eslint.cjs');

module.exports = defineConfig(lintModuleConfig);
