'use strict';

const button = document.querySelector('button');
const gameField = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const cells = [];
let isCellsMoved = false;
let score = 0;

const keydownListener = (ev) => {
  moveCells(ev.key);

  if (isCellsMoved) {
    fillEmptyCell();

    isCellsMoved = false;
  }
};

button.addEventListener('click', () => {
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

function merge(first, second) {
  const nextNum = +first.textContent * 2;

  score += nextNum;
  scoreElement.textContent = score.toString();

  first.textContent = nextNum;
  first.classList.remove(first.classList.item(1));
  first.classList.add('field-cell--' + nextNum);

  second.textContent = '';
  second.classList.remove(second.classList.item(1));

  if (nextNum === 2048) {
    document.querySelector('.message-win')
      .classList.toggle('hidden', true);
  }

  isCellsMoved = true;
}

function mergeUp() {
  for (let c = 0; c < cells[0].length; c++) {
    for (let r = 0; r < cells.length - 1; r++) {
      if (cells[r][c].textContent === cells[r + 1][c].textContent
        && cells[r][c].textContent !== '') {
        merge(cells[r][c], cells[r + 1][c]);
      }
    }
  }
}

function mergeDown() {
  for (let c = 0; c < cells[0].length; c++) {
    for (let r = cells.length - 1; r > 0; r--) {
      if (cells[r][c].textContent === cells[r - 1][c].textContent
        && cells[r][c].textContent !== '') {
        merge(cells[r][c], cells[r - 1][c]);
      }
    }
  }
}

function mergeLeft() {
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length - 1; c++) {
      if (cells[r][c].textContent === cells[r][c + 1].textContent
        && cells[r][c].textContent !== '') {
        merge(cells[r][c], cells[r][c + 1]);
      }
    }
  }
}

function mergeRight() {
  for (let r = 0; r < cells.length; r++) {
    for (let c = cells[r].length - 1; c > 0; c--) {
      if (cells[r][c].textContent === cells[r][c - 1].textContent
        && cells[r][c].textContent !== '') {
        merge(cells[r][c], cells[r][c - 1]);
      }
    }
  }
}

function moveCells(key) {
  switch (key) {
    case 'ArrowUp': {
      moveCellsUp();
      mergeUp();
      moveCellsUp();

      break;
    }

    case 'ArrowDown': {
      moveCellsDown();
      mergeDown();
      moveCellsDown();

      break;
    }

    case 'ArrowRight': {
      moveCellsRight();
      mergeRight();
      moveCellsRight();

      break;
    }

    case 'ArrowLeft': {
      moveCellsLeft();
      mergeLeft();
      moveCellsLeft();

      break;
    }
  }
}

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
  const twosAndFour = [4, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  const randomNumber = twosAndFour[getRandomNumberInRangeInclude(0, 9)];

  cell.classList.toggle('field-cell--' + randomNumber);
  cell.textContent = randomNumber;
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
