'use strict';

const {
  addRandomTwoOrFour,
} = require('./helpers');

function moveRight(grid, trRows, score, pLose) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = grid.length - 1; j >= 0; j--) {
      if (grid[i][j]) {
        let row = j;

        while (row < grid.length - 1) {
          if (!grid[i][row + 1]) {
            grid[i][row + 1] = grid[i][row];
            grid[i][row] = 0;
            row++;
          } else {
            if (grid[i][row + 1] === grid[i][row]) {
              grid[i][row + 1] *= 2;

              score.textContent
                = `${parseFloat(score.textContent) + grid[i][row + 1]}`;

              grid[i][row] = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
  addRandomTwoOrFour(grid, trRows, pLose);
}

function moveLeft(grid, trRows, score, pLose) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j]) {
        let row = j;

        while (row > 0) {
          if (!grid[i][row - 1]) {
            grid[i][row - 1] = grid[i][row];
            grid[i][row] = 0;
            row--;
          } else {
            if (grid[i][row - 1] === grid[i][row]) {
              grid[i][row - 1] *= 2;

              score.textContent
                = `${parseFloat(score.textContent) + grid[i][row - 1]}`;

              grid[i][row] = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
  addRandomTwoOrFour(grid, trRows, pLose);
}

function moveUp(grid, trRows, score, pLose) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i]) {
        let cell = j;

        while (cell > 0) {
          if (!grid[cell - 1][i]) {
            grid[cell - 1][i] = grid[cell][i];
            grid[cell][i] = 0;
            cell--;
          } else {
            if (grid[cell - 1][i] === grid[cell][i]) {
              grid[cell - 1][i] *= 2;

              score.textContent
                = `${parseFloat(score.textContent) + grid[cell - 1][i]}`;

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
  addRandomTwoOrFour(grid, trRows, pLose);
}

function moveDown(grid, trRows, score, pLose) {
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
  addRandomTwoOrFour(grid, trRows, pLose);
}

module.exports = {
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
};
