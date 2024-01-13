'use strict';

const changeCellClass = (cell) => {
  if (cell.textContent) {
    if (cell.classList.length > 1) {
      cell.classList.replace(
        cell.classList[1],
        `field-cell--${cell.textContent}`,
      );
    } else {
      cell.classList.add(`field-cell--${cell.textContent}`);
    }
  } else {
    cell.classList.remove(cell.classList[1]);
  }
};

module.exports = { changeCellClass };
