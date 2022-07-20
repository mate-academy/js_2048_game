export function getRandom(max) {
  return Math.trunc(Math.random() * max);
}

export function findLastIndex(array, callback) {
  for (let i = array.length - 1; i >= 0; --i) {
    if (callback(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}
