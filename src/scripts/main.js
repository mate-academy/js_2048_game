'use strict';

const scoreField = document.querySelector('.game-score');
let score = 0;
let maxCellValue = 0;
let firstRowSum = 0;
let lastRowSum = 0;
let firstColumnSum = 0;
let lastColumnSum = 0;
let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;
let number1 = 2;
let number2 = 2;
const numbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameField = document.querySelector('.game-field');
const fieldCells = document.querySelectorAll('.field-cell');
let restartButton;
const columnsAmount = gameField.rows[0].cells.length;
const rowsAmount = gameField.rows.length;
const firstRow = gameField.rows[0].cells;
const lastRow = gameField.rows[rowsAmount - 1].cells;

startButton.addEventListener('click', startButtonPush);

function startButtonPush() {
  document.addEventListener('keyup', arrowsEvents);
  messageStart.classList.add('hidden');
  startButton.classList.toggle('restart');
  startButton.innerText = 'Restart';
  startButton.removeEventListener('click', startButtonPush);

  restartButton = document.querySelector('.restart');
  restartButton.addEventListener('click', restartButtonPush);

  addStartNumbers();
  countScore();
  styleCell();
}

function restartButtonPush() {
  document.addEventListener('keyup', arrowsEvents);
  score = 0;
  clearGameField();
  addStartNumbers();
  countScore();
  styleCell();
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
}

function findMaxCellValue() {
  const sorted = [...fieldCells].sort((a, b) =>
    +b.innerText - +a.innerText);

  maxCellValue = +sorted[0].innerText;
}

function countScore() {
  scoreField.innerText = score;
}

function winLose() {
  findMaxCellValue();

  if (maxCellValue === 2048) {
    messageWin.classList.remove('hidden');
    document.removeEventListener('keyup', arrowsEvents);

    return;
  }

  const emptyCell = [...fieldCells].find(cellX =>
    cellX.innerText === '');
  const checker = checkAvailableStep();

  if (!emptyCell & checker === 0) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keyup', arrowsEvents);
  }
}

function clearGameField() {
  [...fieldCells].map(cell => {
    cell.innerText = '';
    cell.className = 'field-cell';
  });
}

function randomNumbersStart() {
  x1 = Math.floor(Math.random() * rowsAmount);
  y1 = Math.floor(Math.random() * columnsAmount);
  x2 = Math.floor(Math.random() * rowsAmount);
  y2 = Math.floor(Math.random() * columnsAmount);

  if (x2 === x1 & y2 === y1) {
    randomNumbersStart();
  }

  const z = Math.floor(Math.random() * numbers.length);
  const q = Math.floor(Math.random() * numbers.length);

  number1 = +numbers[z];
  number2 = +numbers[q];
}

function addStartNumbers() {
  randomNumbersStart();
  gameField.rows[x1].cells[y1].innerText = number1;
  gameField.rows[x2].cells[y2].innerText = number2;
}

function randomNumbersNext() {
  x1 = Math.floor(Math.random() * rowsAmount);
  y1 = Math.floor(Math.random() * columnsAmount);

  const r = Math.floor(Math.random() * numbers.length);

  number1 = +numbers[r];

  const cell = gameField.rows[x1].cells[y1];

  if (cell.innerText) {
    randomNumbersNext();
  }
}

function addNumber() {
  randomNumbersNext();
  gameField.rows[x1].cells[y1].innerText = number1;
}

function styleCell() {
  [...fieldCells].map(cell => {
    const value = cell.innerText;

    if (value !== '') {
      cell.className = 'field-cell';
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.className = 'field-cell';
      cell.classList.add(`field-cell--default`);
    }
  });
}

function checkAvailableStep() {
  let checker = 0;

  for (let i = 0; i < columnsAmount; i++) {
    const column = [...fieldCells].filter(cell =>
      cell.cellIndex === i);

    for (let j = 0; j < rowsAmount - 1; j++) {
      if (
        (column[j].innerText !== '')
        & (column[j].innerText === column[j + 1].innerText)
      ) {
        checker++;
      }
    }
  }

  for (let i = 0; i < rowsAmount; i++) {
    const row = [...gameField.rows[i].cells];

    for (let j = 0; j < columnsAmount - 1; j++) {
      if (
        (row[j].innerText !== '')
        & (row[j].innerText === row[j + 1].innerText)
      ) {
        checker++;
      }
    }
  }

  return checker;
}

function findFirstRowSum() {
  firstRowSum = [...firstRow].reduce((sum, current) => {
    if (current.innerText !== '') {
      return sum + +current.innerText;
    } else {
      return sum + 0;
    }
  }, 0);
}

function findLastRowSum() {
  lastRowSum = [...lastRow].reduce((sum, current) => {
    if (current.innerText !== '') {
      return sum + +current.innerText;
    } else {
      return sum + 0;
    }
  }, 0);
}

function findFirstColumnSum() {
  const firstColumn = [...fieldCells].filter(cell =>
    cell.cellIndex === 0);

  firstColumnSum = [...firstColumn].reduce((sum, current) => {
    if (current.innerText !== '') {
      return sum + +current.innerText;
    } else {
      return sum + 0;
    }
  }, 0);
}

function findLastColumnSum() {
  const lastColumn = [...fieldCells].filter(cell =>
    cell.cellIndex === columnsAmount - 1);

  lastColumnSum = [...lastColumn].reduce((sum, current) => {
    if (current.innerText !== '') {
      return sum + +current.innerText;
    } else {
      return sum + 0;
    }
  }, 0);
}

function arrowUp() {
  findFirstRowSum();

  const checkScore1 = score;
  const checkSum1 = firstRowSum;

  addUp();
  countScore();
  findFirstRowSum();

  const checkScore2 = score;
  const checkSum2 = firstRowSum;

  if (checkScore2 > checkScore1
    || checkSum2 !== checkSum1) {
    addNumber();
  }
  styleCell();
  winLose();
};

function arrowDown() {
  findLastRowSum();

  const checkScore1 = score;
  const checkSum1 = lastRowSum;

  addDown();
  countScore();
  findLastRowSum();

  const checkScore2 = score;
  const checkSum2 = lastRowSum;

  if (checkScore2 > checkScore1
    || checkSum2 !== checkSum1) {
    addNumber();
  }
  styleCell();
  winLose();
};

function arrowLeft() {
  findFirstColumnSum();

  const checkScore1 = score;
  const checkSum1 = firstColumnSum;

  addLeft();
  countScore();
  findFirstColumnSum();

  const checkScore2 = score;
  const checkSum2 = firstColumnSum;

  if (checkScore2 > checkScore1
    || checkSum2 !== checkSum1) {
    addNumber();
  }
  styleCell();
  winLose();
};

function arrowRight() {
  findLastColumnSum();

  const checkScore1 = score;
  const checkSum1 = lastColumnSum;

  addRight();
  countScore();
  findLastColumnSum();

  const checkScore2 = score;
  const checkSum2 = lastColumnSum;

  if (checkScore2 > checkScore1
    || checkSum2 !== checkSum1) {
    addNumber();
  }
  styleCell();
  winLose();
};

// eslint-disable-next-line no-shadow
function arrowsEvents(event) {
  switch (event.code) {
    case 'ArrowUp':
      arrowUp();
      break;

    case 'ArrowDown':
      arrowDown();
      break;

    case 'ArrowLeft':
      arrowLeft();
      break;

    case 'ArrowRight':
      arrowRight();
      break;

    default:
      break;
  }
}

function addUp() {
  for (let i = 0; i < columnsAmount; i++) {
    const column = [...fieldCells].filter(cell =>
      cell.cellIndex === i);

    column.forEach(() => moveInnerTextUpLeft(column, 0, rowsAmount - 1));
    mergeInnerTextUpLeft(column, 0, rowsAmount - 1);
  }
}

function addDown() {
  for (let i = 0; i < columnsAmount; i++) {
    const column = [...fieldCells].filter((cell) => cell.cellIndex === i);

    column.forEach(() => moveInnerTextDownRight(column, rowsAmount - 1, 0));
    mergeInnerTextDownRight(column, rowsAmount - 1, 0);
  }
}

function addLeft() {
  for (let i = 0; i < rowsAmount; i++) {
    const row = [...gameField.rows[i].cells];

    row.forEach(() => moveInnerTextUpLeft(row, 0, columnsAmount - 1));
    mergeInnerTextUpLeft(row, 0, columnsAmount - 1);
  }
}

function addRight() {
  for (let i = 0; i < rowsAmount; i++) {
    const row = [...gameField.rows[i].cells];

    row.forEach(() => moveInnerTextDownRight(row, columnsAmount - 1, 0));
    mergeInnerTextDownRight(row, columnsAmount - 1, 0);
  }
}

function mergeInnerTextUpLeft(cellsArray, start, end) {
  for (let j = start; j < end; j++) {
    if (
      (cellsArray[j].innerText !== '')
      & (cellsArray[j].innerText === cellsArray[j + 1].innerText)
    ) {
      cellsArray[j].innerText = +cellsArray[j].innerText * 2;
      cellsArray[j + 1].innerText = '';
      score += +cellsArray[j].innerText;
    }
  }
}

function moveInnerTextUpLeft(cellsArray, start, end) {
  for (let k = start; k < end; k++) {
    if (cellsArray[k].innerText === '') {
      cellsArray[k].innerText = cellsArray[k + 1].innerText;
      cellsArray[k + 1].innerText = '';
    }
  }
}

function mergeInnerTextDownRight(cellsArray, start, end) {
  for (let j = start; j > end; j--) {
    if (
      (cellsArray[j].innerText !== '')
      & (cellsArray[j].innerText === cellsArray[j - 1].innerText)
    ) {
      cellsArray[j].innerText = +cellsArray[j].innerText * 2;
      cellsArray[j - 1].innerText = '';
      score += +cellsArray[j].innerText;
    }
  }
}

function moveInnerTextDownRight(cellsArray, start, end) {
  for (let k = start; k > end; k--) {
    if (cellsArray[k].innerText === '') {
      cellsArray[k].innerText = cellsArray[k - 1].innerText;
      cellsArray[k - 1].innerText = '';
    }
  }
}
