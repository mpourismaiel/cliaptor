const clipboardy = require('clipboardy');
const clipator = require('../clipator');

module.exports = async id => {
  const item = clipator.get(id);
  if (item) {
    clipboardy.write(item);
    return { message: 'Item copied' };
  } else {
    throw { message: 'Item not found', status: 404 };
  }
};
