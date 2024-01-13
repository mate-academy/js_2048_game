'use strict';

const isTurnPossible = (field) => {
  for (let row = 0; row < field.length; row++) {
    for (let col = 0; col < field[row].length; col++) {
      const currentCell = field[row][col];

      for (let i = row + 1; i < field.length; i++) {
        const comparedCell = field[i][col];

        if (comparedCell.textContent) {
          if (!currentCell.textContent) {
            return true;
          } else if (currentCell.textContent === comparedCell.textContent) {
            return true;
          } else {
            break;
          }
        }
      }
    }
  }

  for (let row = field.length - 1; row >= 0; row--) {
    for (let col = 0; col < field[row].length; col++) {
      const currentCell = field[row][col];

      for (let i = row - 1; i >= 0; i--) {
        const comparedCell = field[i][col];

        if (comparedCell.textContent) {
          if (!currentCell.textContent) {
            return true;
          } else if (currentCell.textContent === comparedCell.textContent) {
            return true;
          } else {
            break;
          }
        }
      }
    }
  }

  for (let col = 0; col < field.length; col++) {
    for (let row = 0; row < field.length; row++) {
      const currentCell = field[row][col];

      for (let i = col + 1; i < field.length; i++) {
        const comparedCell = field[row][i];

        if (comparedCell.textContent) {
          if (!currentCell.textContent) {
            return true;
          } else if (currentCell.textContent === comparedCell.textContent) {
            return true;
          } else {
            break;
          }
        }
      }
    }
  }

  for (let col = field.length - 1; col >= 0; col--) {
    for (let row = 0; row < field.length; row++) {
      const currentCell = field[row][col];

      for (let i = col - 1; i >= 0; i--) {
        const comparedCell = field[row][i];

        if (comparedCell.textContent) {
          if (!currentCell.textContent) {
            return true;
          } else if (currentCell.textContent === comparedCell.textContent) {
            return true;
          } else {
            break;
          }
        }
      }
    }
  }

  return false;
};

module.exports = { isTurnPossible };
