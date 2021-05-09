'use strict';

const button = document.querySelector('button');
const gameField = document.querySelector('.game-field');
const cells = [];
let isCellsMoved = false;

const keydownListener = (ev) => {
  switch (ev.key) {
    case 'ArrowUp': {
      moveCellsUp();

      break;
    }

    case 'ArrowDown': {
      moveCellsDown();

      break;
    }

    case 'ArrowRight': {
      moveCellsRight();

      break;
    }

    case 'ArrowLeft': {
      moveCellsLeft();

      break;
    }
  }

  if (isCellsMoved) {
    fillEmptyCell();

    isCellsMoved = false;
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

function moveCellsLeft() {
  for (let c = 1; c < cells[0].length; c++) {
    for (let r = 0; r < cells.length; r++) {
      if (cells[r][c].classList.length > 1) {
        for (let subC = 0; subC < c; subC++) {
          if (cells[r][subC].classList.length === 1) {
            swapCells(cells[r][c], cells[r][subC]);

            break;
          }
        }
      }
    }
  }
}

function moveCellsRight() {
  for (let c = cells[0].length - 2; c >= 0; c--) {
    for (let r = 0; r < cells.length; r++) {
      if (cells[r][c].classList.length > 1) {
        for (let subC = cells[r].length - 1; subC > c; subC--) {
          if (cells[r][subC].classList.length === 1) {
            swapCells(cells[r][c], cells[r][subC]);

            break;
          }
        }
      }
    }
  }
}

function moveCellsUp() {
  for (let r = 1; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      if (cells[r][c].classList.length > 1) {
        for (let subR = 0; subR < r; subR++) {
          if (cells[subR][c].classList.length === 1) {
            swapCells(cells[r][c], cells[subR][c]);

            break;
          }
        }
      }
    }
  }
}

function moveCellsDown() {
  for (let r = cells.length - 2; r >= 0; r--) {
    for (let c = 0; c < cells[r].length; c++) {
      if (cells[r][c].classList.length > 1) {
        for (let subR = cells.length - 1; subR > r; subR--) {
          if (cells[subR][c].classList.length === 1) {
            swapCells(cells[r][c], cells[subR][c]);

            break;
          }
        }
      }
    }
  }
}

function swapCells(first, second) {
  const cellClass = first.classList.item(1);

  second.classList.add(cellClass);
  first.classList.remove(cellClass);
  second.textContent = first.textContent;
  first.textContent = '';

  isCellsMoved = true;
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
