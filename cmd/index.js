const path = require('path');
const fs = require('fs');
const { toCamelCase } = require('../utils/string');
const clipator = require('../clipator');

const commands = {
  read: (count = 100, length = 80) =>
    clipator
      .read()
      .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
      .map(item => ({
        ...item,
        input: item.input
          .replace(/\s/g, ' ')
          .trim()
          .slice(0, length),
      }))
      .slice(0, count),
  set: clipator.set,
  setLength: length => clipator.setLength(length),
  getLength: () => clipator.length,
  mark: require('./mark'),
  copy: require('./copy'),
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
