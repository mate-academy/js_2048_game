'use strict';

const button = document.querySelector('button');
const gameField = document.querySelector('.game-field');
const cells = [];

const keydownListener = (ev) => {
  switch (ev.key) {
    case 'ArrowUp': {
      for (let i = 1; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
          if (cells[i][j].classList.length > 1) {
            for (let k = 0; k < i; k++) {
              if (cells[k][j].classList.length === 1) {
                swapCells(cells[i][j], cells[k][j]);

                break;
              }
            }
          }
        }
      }

      break;
    }

    case 'ArrowDown': {
      for (let i = cells.length - 2; i >= 0; i--) {
        for (let j = 0; j < cells[i].length; j++) {
          if (cells[i][j].classList.length > 1) {
            for (let k = cells.length - 1; k > i; k--) {
              if (cells[k][j].classList.length === 1) {
                swapCells(cells[i][j], cells[k][j]);

                break;
              }
            }
          }
        }
      }

      break;
    }

    case 'ArrowRight': {
      break;
    }

    case 'ArrowLeft': {
      break;
    }
  }
};

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

    document.removeEventListener('keydown', keydownListener);
  } else {
    button.textContent = 'Restart';

    fillEmptyCell();
    fillEmptyCell();

    document.addEventListener('keydown', keydownListener);
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

function swapCells(first, second) {
  const cellClass = first.classList.item(1);

  second.classList.add(cellClass);
  first.classList.remove(cellClass);
  second.textContent = first.textContent;
  first.textContent = '';
}

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
