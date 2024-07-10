function getCapitalizedWord(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function getRandomArrayIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

module.exports = {
  getCapitalizedWord,
  getRandomArrayIndex,
};
