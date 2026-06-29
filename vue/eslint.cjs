const {
  defineConfig,
  globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const pluginVue = require("eslint-plugin-vue");

const lintModuleConfig = defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    rules: {
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
  },
  {
    files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  globalIgnores([
    "config/**/*",
    "dist/**/*",
    "mochawesome-report/**/*",
    "node_modules/**/*",
    "public/**/*",
    "scripts/**/*",
    "src/generated/**/*",
    "tests/**/*",
    "src/**/*.js",
  ]),
);

module.exports = { lintModuleConfig };
