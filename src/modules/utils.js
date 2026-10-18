'use strict';

function transpose(grid) {
  return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
}

function foldNumbers(field) {
  let filteredField = field.filter((x) => x !== 0);
  let roundScore = 0;

  for (let i = 0; i < filteredField.length; i++) {
    if (filteredField[i] === filteredField[i + 1]) {
      filteredField[i] *= 2;
      roundScore += filteredField[i];
      filteredField[i + 1] = 0;
      i++;
    }
  }

  filteredField = filteredField.filter((x) => x !== 0);

  while (filteredField.length < 4) {
    filteredField.push(0);
  }

  return {
    line: filteredField,
    score: roundScore,
  };
}

module.exports = {
  transpose,
  foldNumbers,
};
