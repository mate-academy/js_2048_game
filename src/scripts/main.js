'use strict';

const button = document.querySelector('button');
const gameField = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
let cells;
let isCellsMoved = false;
let score = 0;

initGameField();

const keydownListener = (ev) => {
  moveCells(ev.key);

  if (isCellsMoved) {
    fillEmptyCell();

    isCellsMoved = false;
  } else {
    if (!checkNextMovePossibility()) {
      loseMessage.classList.toggle('hidden', false);
    }
  }

  updateHtmlGameField();
};

button.addEventListener('click', () => {
  button.classList.toggle('start');
  button.classList.toggle('restart');

  if (button.classList.contains('start')) {
    button.textContent = 'Start';

    initGameField();

    score = 0;
    scoreElement.textContent = '0';

    document.removeEventListener('keydown', keydownListener);
  } else {
    button.textContent = 'Restart';

    fillEmptyCell();
    fillEmptyCell();

    document.addEventListener('keydown', keydownListener);
  }

  updateHtmlGameField();

  document.querySelector('.message-start')
    .classList.toggle('hidden');
  loseMessage.classList.toggle('hidden', true);
  winMessage.classList.toggle('hidden', true);
});

function updateHtmlGameField() {
  const tbody = document.createElement('tbody');

  for (let i = 0; i < 4; i++) {
    const tr = document.createElement('tr');

    tr.classList.add('field-row');

    for (let j = 0; j < 4; j++) {
      const td = document.createElement('td');

      td.classList.add('field-cell');
      td.textContent = cells[i][j];

      if (cells[i][j]) {
        td.classList.add('field-cell--' + cells[i][j]);
      }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  gameField.replaceChild(tbody, gameField.firstElementChild);
}

function initGameField() {
  cells = [];

  for (let i = 0; i < 4; i++) {
    cells.push([]);

    for (let j = 0; j < 4; j++) {
      cells[i][j] = '';
    }
  }
}

function checkNextMovePossibility() {
  return (getEmptyCells().length !== 0)
    || mergeUp()
    || mergeLeft()
    || mergeDown()
    || mergeRight();
}

function merge(i0, j0, i1, j1) {
  const nextNum = +cells[i0][j0] * 2;

  score += nextNum;
  scoreElement.textContent = score.toString();

  cells[i0][j0] = nextNum;
  cells[i1][j1] = '';

  if (nextNum === 2048) {
    winMessage.classList.toggle('hidden', false);
  }

  isCellsMoved = true;
}

function mergeUp(force) {
  let isMerged = false;

  for (let c = 0; c < cells[0].length; c++) {
    for (let r = 0; r < cells.length - 1; r++) {
      if (cells[r][c] === cells[r + 1][c]
        && cells[r][c] !== '') {
        if (force) {
          merge(r, c, r + 1, c);
        }

        isMerged = true;
      }
    }
  }

  return isMerged;
}

function mergeDown(force) {
  let isMerged = false;

  for (let c = 0; c < cells[0].length; c++) {
    for (let r = cells.length - 1; r > 0; r--) {
      if (cells[r][c] === cells[r - 1][c]
        && cells[r][c] !== '') {
        if (force) {
          merge(r, c, r - 1, c);
        }

        isMerged = true;
      }
    }
  }

  return isMerged;
}

function mergeLeft(force) {
  let isMerged = false;

  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length - 1; c++) {
      if (cells[r][c] === cells[r][c + 1]
        && cells[r][c] !== '') {
        if (force) {
          merge(r, c, r, c + 1);
        }

        isMerged = true;
      }
    }
  }

  return isMerged;
}

function mergeRight(force) {
  let isMerged = false;

  for (let r = 0; r < cells.length; r++) {
    for (let c = cells[r].length - 1; c > 0; c--) {
      if (cells[r][c] === cells[r][c - 1]
        && cells[r][c] !== '') {
        if (force) {
          merge(r, c, r, c - 1);
        }

        isMerged = true;
      }
    }
  }

  return isMerged;
}

function moveCells(key) {
  switch (key) {
    case 'ArrowUp': {
      moveCellsUp();
      mergeUp(true);
      moveCellsUp();

      break;
    }

    case 'ArrowDown': {
      moveCellsDown();
      mergeDown(true);
      moveCellsDown();

      break;
    }

    case 'ArrowRight': {
      moveCellsRight();
      mergeRight(true);
      moveCellsRight();

      break;
    }

    case 'ArrowLeft': {
      moveCellsLeft();
      mergeLeft(true);
      moveCellsLeft();

      break;
    }
  }
}

function moveCellsLeft() {
  for (let c = 1; c < cells[0].length; c++) {
    for (let r = 0; r < cells.length; r++) {
      if (cells[r][c] !== '') {
        for (let subC = 0; subC < c; subC++) {
          if (cells[r][subC] === '') {
            swapCells(r, c, r, subC);

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
      if (cells[r][c] !== '') {
        for (let subC = cells[r].length - 1; subC > c; subC--) {
          if (cells[r][subC] === '') {
            swapCells(r, c, r, subC);

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
      if (cells[r][c] !== '') {
        for (let subR = 0; subR < r; subR++) {
          if (cells[subR][c] === '') {
            swapCells(r, c, subR, c);

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
      if (cells[r][c] !== '') {
        for (let subR = cells.length - 1; subR > r; subR--) {
          if (cells[subR][c] === '') {
            swapCells(r, c, subR, c);

            break;
          }
        }
      }
    }
  }
}

function swapCells(i0, j0, i1, j1) {
  const a = cells[i0][j0];

  cells[i0][j0] = cells[i1][j1];
  cells[i1][j1] = a;

  isCellsMoved = true;
}

function fillEmptyCell() {
  const emptyCells = getEmptyCells();
  const numOfCell = getRandomNumberInRangeInclude(0, emptyCells.length - 1);
  const cell = emptyCells[numOfCell];

  cells[cell.row][cell.cell] = get2Or4();
}

function get2Or4() {
  const twosAndFour = [4, 2, 2, 2, 2, 2, 2, 2, 2, 2];

  return twosAndFour[getRandomNumberInRangeInclude(0, 9)];
}

function getEmptyCells() {
  const emptyCells = [];

  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      if (cells[i][j] === '') {
        emptyCells.push({
          row: i,
          cell: j,
        });
      }
    }
  }

  return emptyCells;
}

function getRandomNumberInRangeInclude(min, max) {
  return min + Math.round(max * Math.random());
}
