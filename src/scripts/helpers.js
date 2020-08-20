'use strict';

const {
  WIN_NUMBER,
  MAIN_CLASS_CELL,
} = require('./constants');

function addStyleToField(fieldRow) {
  for (let i = 0; i < fieldRow.length; i++) {
    for (let j = 0; j < fieldRow.length; j++) {
      const newClass = `field-cell--${fieldRow[i].cells[j].textContent}`;

      fieldRow[i].cells[j].classList.remove(...fieldRow[i].cells[j].classList);
      fieldRow[i].cells[j].classList.add(MAIN_CLASS_CELL);

      if (fieldRow[i].cells[j].textContent !== '') {
        fieldRow[i].cells[j].classList.add(newClass);
      }
    }
  }
}

function addRandomTwoOrFour(grid, trRows, pLose) {
  const option = getEmptyCells(grid);

  if (option.length === 0) {
    pLose.classList.remove('hidden');

    return;
  }

  const randomPos = Math.round(Math.random() * (option.length - 1));
  const rand = Math.random(1);

  grid[option[randomPos].x][option[randomPos].y] = rand > 0.1 ? 2 : 4;
  renderField(grid, trRows);
}

function getEmptyCells(grid) {
  const arrEmptyCells = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === 0) {
        arrEmptyCells.push({
          x: i,
          y: j,
        });
      }
    }
  }

  return arrEmptyCells;
}

function resetField(grid, trRow) {
  for (let i = 0; i < trRow.length; i++) {
    for (let j = 0; j < trRow.length; j++) {
      grid[i][j] = 0;
      trRow[i].cells[j].textContent = '';
    }
  }
}

function renderField(grid, trRows) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] !== 0) {
        trRows[i].cells[j].textContent = `${grid[i][j]}`;
      } else {
        trRows[i].cells[j].textContent = '';
      }
    }
  }
  addStyleToField(trRows);
}

function finishedGame(gid, messageWin) {
  const maxNumber = [];

  for (let i = 0; i < gid.length; i++) {
    maxNumber.push(Math.max(...gid[i]));
  }

  if (Math.max(...maxNumber) === WIN_NUMBER) {
    messageWin.classList.remove('hidden');
  }
}

module.exports = {
  addRandomTwoOrFour,
  resetField,
  finishedGame,
};
