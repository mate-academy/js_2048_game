export function getCapitalizedWord(word) {
  return word[0].toUpperCase() + word.slice(1);
}

export function getRandomArrayIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}
