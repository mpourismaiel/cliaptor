const clipboardy = require('clipboardy');
const UUID = require('./utils/uuid');

const Clipator = () => {
  let store = [];
  let length = process.env.MEMORY_LENGTH || 100;
  let delay = process.env.DELAY || 2000;
  let timer = null;

  const setLength = newLength => (length = newLength);
  const setDelay = newDelay => (delay = newDelay);

  // Getters
  const exists = ({ key, value }) => store.some(item => item[key] === value);
  const get = id => store.find(item => item.id === id);
  const read = () => store;

  // Setters
  const add = ({ input, id }) => {
    store.unshift({ input, id });
    if (store.length > length) {
      store.pop();
    }
    sort();
  };
  const set = (id, key, value) =>
    (store = store.map(item =>
      item.id === id ? { ...item, [key]: value } : item,
    ));
  const remove = ({ key, value }) =>
    (store = store.filter(item => item[key] !== value));
  const sort = () =>
    (store = store.sort((a, b) =>
      a.favorite && !b.favorite ? -1 : b.favorite && !a.favorite ? 1 : 0,
    ));
  const clear = () => (store = []);

  // Procedures
  const loop = async () => {
    const input = await clipboardy.read();
    timer = setTimeout(loop, delay);
    if (!input) {
      return;
    }

    if (store[0] && store[0].input === input) {
      return;
    }

    remove({ key: 'input', value: input });
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

module.exports = Clipator();
