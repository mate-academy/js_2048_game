'use strict';

const isTurnPossible = (field) => {
  for (let row = 0; row < field.length; row++) {
    for (let col = 0; col < field.length; col++) {
      const currentCell = field[row][col];

      if (currentCell.textContent === '') {
        return true;
      }
    }
  }

  for (let row = 0; row < field.length; row++) {
    for (let col = 0; col < field.length; col++) {
      const currentCellValue = field[row][col].textContent;
      const comparedCell1Value = field[row + 1]
        ? field[row + 1][col].textContent
        : null;
      const comparedCell2Value = field[row][col + 1]
        ? field[row][col + 1].textContent
        : null;

      if (currentCellValue === comparedCell1Value
      || currentCellValue === comparedCell2Value) {
        return true;
      }
    }
  }

  return false;
};

module.exports = { isTurnPossible };
