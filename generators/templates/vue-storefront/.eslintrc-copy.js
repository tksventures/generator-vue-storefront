module.exports = {
  root: true,
  env: { 'browser': true, 'jest': true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 8,
    sourceType: "module"
  },
  extends: [],
  plugins: [
    'vue',
    'vue-storefront'
  ],
  // add your custom rules here
  rules: {}
}