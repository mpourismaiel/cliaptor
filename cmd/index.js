const path = require('path');
const fs = require('fs');
const { toCamelCase } = require('../utils/string');
const clipator = require('../clipator');

const commands = {
  read: clipator.read,
  set: clipator.set,
  setLength: length => clipator.setLength(length),
  getLength: () => clipator.length,
};

fs.readdirSync(path.resolve(__dirname)).forEach(function(file) {
  if (file !== 'index.js') {
    commands[toCamelCase(file.slice(0, file.indexOf('.')))] = require('./' +
      file);
  }
});

module.exports = {
  ...commands,
  help: () => {
    return {
      urlSchema: '/[command]/[arg1]/[arg2]/[...]',
      commands: ['help'].concat(Object.keys(commands)),
    };
  },
};
