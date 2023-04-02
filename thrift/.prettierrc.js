module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: false,
  importOrder: [
    "^react",
    "^react-dom.*",
    "chakra-ui",
    "^(?![.]).*", // other 3rd party libraries
    "^[.].*(?<!css)$", // local dependencies (except css)
    "^[.].*css$", // local CSS files
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
