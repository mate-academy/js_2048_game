'use strict';

const checkIsCorrectlyAligned = (cellsArray, alignment, cursor = null) => {
  if (cellsArray.length !== 4) {
    throw new Error('Array must have exactly 4 elements');
  }

  switch (alignment) {
    case 'start': {
      let isZeroFoundStart = false;

      for (const cell of cellsArray) {
        if (cell === 0) {
          isZeroFoundStart = true;
        } else if (isZeroFoundStart) {
          return false;
        }

        if (cursor !== null && cell === cursor) {
          break;
        }
      }

      return !isZeroFoundStart || cursor !== null;
    }

    case 'end': {
      let isZeroFoundEnd = false;

      for (let i = cellsArray.length - 1; i >= 0; i--) {
        const cell = cellsArray[i];

        if (cell === 0) {
          isZeroFoundEnd = true;
        } else if (isZeroFoundEnd) {
          return false;
        }

        if (cursor !== null && cell === cursor) {
          break;
        }
      }

      return !isZeroFoundEnd || cursor !== null;
    }

    default:
      throw new Error('Unknown alignment');
  }
};

const getCellFromState = (game) => (rowIndex, colIndex) => {
  const state = game.getState();

  return state[rowIndex][colIndex];
};

const transposeState = (state) => {
  const size = state.length;
  const result = [...Array(size)].map(() => Array(size).fill(0));

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    for (let colIndex = 0; colIndex < size; colIndex++) {
      result[colIndex][rowIndex] = state[rowIndex][colIndex];
    }
  }

  return result;
};

const cloneState = (state) => {
  const clone = [];

  for (const row of state) {
    clone.push([...row]);
  }

  return clone;
};

module.exports = {
  checkIsCorrectlyAligned,
  getCellFromState,
  transposeState,
  cloneState,
};
