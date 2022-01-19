const basePath = process.cwd();
const {
  dryCreating,
  startCreating,
  buildSetup,
} = require(`${basePath}/src/main.js`);

(() => {
  buildSetup();
  dryCreating();
  // startCreating();
})();
