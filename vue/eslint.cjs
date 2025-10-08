const {
  globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const parser = require("vue-eslint-parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const lintModuleConfig = [{
  languageOptions: {
      globals: {
          ...globals.node,
          ...globals.browser,
      },

      parser: parser,

      parserOptions: {
          "parser": "@typescript-eslint/parser",
      },
  },

  extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:vue/recommended",
  ),

  "rules": {
      "array-bracket-spacing": ["error", "never"],
      "no-useless-constructor": "off",
      "operator-linebreak": ["error", "before"],
      "newline-per-chained-call": "error",
      "brace-style": ["error", "stroustrup"],
      "@typescript-eslint/no-unused-vars": "off",
      "vue/multi-word-component-names": "off",
      "no-use-before-define": "off",
      "no-unused-expressions": "off",

      "space-before-function-paren": ["error", {
          "anonymous": "never",
          "named": "never",
          "asyncArrow": "always",
      }],

      "@typescript-eslint/no-explicit-any": "off",

      "indent": ["error", 2, {
          "ignoredNodes": ["PropertyDefinition"],
      }],

      "comma-dangle": ["error", "always-multiline"],
      "linebreak-style": process.platform === "win32" ? 0 : ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-console": "off",
      "no-debugger": "error",
  },
}, {
  files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],

  languageOptions: {
      globals: {
          ...globals.jest,
      },
  },
}, globalIgnores([
  "config/**/*",
  "dist/**/*",
  "mochawesome-report/**/*",
  "node_modules/**/*",
  "public/**/*",
  "scripts/**/*",
  "src/generated/**/*",
  "tests/**/*",
  "src/**/*.js",
])];

module.exports = { lintModuleConfig };
