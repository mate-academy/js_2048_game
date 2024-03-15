/**
 *
 * @param {number} max
 * @param {number} min
 * @returns random number from `min` inclusive to `max` exclusive
 * @example getRandomNumber(10, 20): // any number in [10, 11...19]
 */

function getRandomNumber(max, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = getRandomNumber;
