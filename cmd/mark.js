const clipator = require('../clipator');

module.exports = id => {
  const item = clipator.get(id);
  if (!item) {
    return { message: 'Item not found', status: 404 };
  }

  clipator.set(id, 'favorite', !item.favorite);
  return clipator.get(id);
};
