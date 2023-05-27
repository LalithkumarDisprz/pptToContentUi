module.exports = {
  '*.js':
    'eslint --cache --fix --cache-location=./node_modules/.cache/eslint/.eslintcache',
  '*.{scss,css}':
    'stylelint --cache --fix --cache-location=./node_modules/.cache/stylelint/.stylelintcache',
};
