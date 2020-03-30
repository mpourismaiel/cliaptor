const clipboardy = require('clipboardy');
const fs = require('fs');
const path = require('path');
const UUID = require('./utils/uuid');

const Clipator = () => {
  let store = [];
  let length = process.env.MEMORY_LENGTH || 100;
  let delay = process.env.DELAY || 2000;
  let timer = null;

  const setLength = newLength => (length = newLength);
  const setDelay = newDelay => (delay = newDelay);

  // Cachce
  try {
    if (fs.existsSync(path.resolve('./cache'))) {
      const data = fs.readFileSync(path.resolve('./cache'));
      store = JSON.parse(data);
    }
  } catch (err) {
    store = [];
  }

  const cachableSetter = (key, fn) => (...args) => {
    const store = fn(...args);

    setTimeout(
      () =>
        fs.writeFile(
          path.resolve('./cache'),
          JSON.stringify((store || []).filter(clip => clip.favorite)),
          { encoding: 'utf-8' },
          err => {
            if (!err) {
              return;
            }

            throw new Error(err);
          },
        ),
      0,
    );

    return store;
  };

  // Getters
  const exists = ({ key, value }) => store.some(item => item[key] === value);
  const get = id => store.find(item => item.id === id);
  const read = () => store;

  // Setters
  const add = cachableSetter('add', ({ input, id, created_at }) => {
    if (store.some(clip => clip.input === input)) {
      return store;
    }

    store.unshift({ input, id, created_at });
    sort();
    return store;
  });

  const set = cachableSetter('set', (id, key, value) => {
    store = store.map(item =>
      item.id === id ? { ...item, [key]: value } : item,
    );
    return store;
  });

  const remove = cachableSetter('remove', ({ key, value }) => {
    store = store.filter(item => item[key] !== value);
    return store;
  });

  const sort = cachableSetter('sort', () => {
    store = store.sort((a, b) =>
      a.favorite && !b.favorite
        ? -1
        : b.favorite && !a.favorite
        ? 1
        : a.created_at > b.created_at
        ? -1
        : 1,
    );
    return store;
  });

  const clear = cachableSetter('clear', () => {
    store = store.filter(clip => clip.favorite);
    return store;
  });

  // Procedures
  const loop = async () => {
    const input = await clipboardy.read();
    timer = setTimeout(loop, delay);
    if (!input) {
      return;
    }

    add({ input, id: UUID(), created_at: Date.now() });
  };

  const start = () => (timer = setTimeout(loop, 0));
  const kill = () => clearTimeout(timer);

  // Actions
  start();

  // You know!
  return {
    read,
    length,
    setLength,
    delay,
    setDelay,
    exists,
    add,
    get,
    set,
    remove,
    sort,
    clear,
    loop,
    start,
    kill,
  };
};

const clipator = Clipator();

module.exports = clipator;
