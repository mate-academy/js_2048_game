'use strict';

const button = document.querySelector('button');
const gameField = document.querySelector('.game-field');
const cells = [];

button.addEventListener('click', ev => {
  button.classList.toggle('start');
  button.classList.toggle('restart');

  if (button.classList.contains('start')) {
    button.textContent = 'Start';

    document.querySelectorAll('td')
      .forEach(cell => {
        cell.classList.remove(cell.classList.item(1));
        cell.textContent = '';
      });
  } else {
    button.textContent = 'Restart';

    fillEmptyCell();
    fillEmptyCell();
  }

  document.querySelector('.message-start')
    .classList.toggle('hidden');
});

gameField.querySelectorAll('tr')
  .forEach(row => {
    const rowOfCells = [];

    row.querySelectorAll('td')
      .forEach(cell => {
        rowOfCells.push(cell);
      });

    cells.push(rowOfCells);
  });

function fillEmptyCell() {
  const emptyCells = getEmptyCells();
  const numOfCell = getRandomNumberInRangeInclude(0, emptyCells.length - 1);
  const cell = emptyCells[numOfCell];

  fillCell2(cell);
}

function fillCell2(cell) {
  cell.classList.toggle('field-cell--2');
  cell.textContent = 2;
}

function getEmptyCells() {
  const emptyCells = [];

  document.querySelectorAll('td')
    .forEach(cell => {
      if (cell.classList.length === 1) {
        emptyCells.push(cell);
      }
    });

  return emptyCells;
}

function getRandomNumberInRangeInclude(min, max) {
  return min + Math.round(max * Math.random());
}
