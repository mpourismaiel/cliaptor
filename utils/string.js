const toCamelCase = str => {
  let tmp = '';

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '-') {
      tmp += str[++i].toUpperCase();
    } else {
      tmp += str[i];
    }
  }

  return tmp;
};

module.exports = {
  toCamelCase,
};
