'use strict';

const {
  addRandomTwoOrFour,
} = require('./helpers');

function rotateMatrix(grid, count) {
  const N = grid.length;

  for (let k = 0; k < count; k++) {
    for (let i = 0; i < grid.length / 2; i++) {
      for (let j = i; j < N - i - 1; j++) {
        const temp = grid[N - 1 - j][i];

        grid[N - 1 - j][i] = grid[N - 1 - i][N - 1 - j];
        grid[N - 1 - i][N - 1 - j] = grid[j][N - 1 - i];
        grid[j][N - 1 - i] = grid[i][j];
        grid[i][j] = temp;
      }
    }
  }
}

function mergeNumbers(grid, trRows, score, pLose, TURN) {
  rotateMatrix(grid, TURN.FIRST);

  for (let i = 0; i < grid.length; i++) {
    for (let j = grid.length - 1; j >= 0; j--) {
      if (grid[j][i]) {
        let cell = j;

        while (cell < grid.length - 1) {
          if (!grid[cell + 1][i]) {
            grid[cell + 1][i] = grid[cell][i];
            grid[cell][i] = 0;
            cell++;
          } else {
            if (grid[cell + 1][i] === grid[cell][i]) {
              grid[cell + 1][i] *= 2;

              score.textContent
                = `${parseFloat(score.textContent) + grid[cell + 1][i]}`;

              grid[cell][i] = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
  rotateMatrix(grid, TURN.SECOND);
  addRandomTwoOrFour(grid, trRows, pLose);
}

module.exports = {
  mergeNumbers,
};
