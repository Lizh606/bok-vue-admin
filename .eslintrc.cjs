/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
    "'./.eslintrc-auto-import.json',"
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    "no-unused-vars": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
