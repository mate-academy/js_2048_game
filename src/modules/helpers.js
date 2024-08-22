'use strict';

function getRandomIndex(num) {
  return Math.floor(Math.random() * num);
}

function createFreeNumber(min, max) {
  return Math.random() < 0.9 ? min : max;
}

module.exports = {
  getRandomIndex,
  createFreeNumber,
};
