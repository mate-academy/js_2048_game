'use strict';

const cells = [...document.querySelectorAll('.field-cell')];
const start = document.querySelector('.start');
const rowsCollection = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');
const messages = document.querySelectorAll('.message');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

cells.forEach((cell, index) => {
  cell.dataset.num = `${index + 1}`;
});

function generateEven() {
  const num = Math.random();

  return num <= 0.1 ? 4 : 2;
}

function generateCellNoRepeated() {
  const randomArr = [];
  const number1 = Math.ceil(Math.random() * 16);

  randomArr.push(number1);

  let number2 = Math.ceil(Math.random() * 16);

  while (randomArr.includes(number2)) {
    number2 = Math.ceil(Math.random() * 16);
  }

  randomArr.push(number2);

  return randomArr;
}

function erase() {
  cells.forEach(cell => {
    cell.className = 'field-cell';
    cell.innerHTML = '';
  });
}

start.addEventListener('click', () => {
  start.className = 'button restart';
  start.innerText = 'Restart';
  erase();
  score.innerText = '0';

  const value1 = generateEven();
  const value2 = generateEven();

  const firstCells = generateCellNoRepeated();

  const firstGenerated
  = document.querySelector(`[data-num="${firstCells[0]}"]`);
  const secondGenerated
  = document.querySelector(`[data-num="${firstCells[1]}"]`);

  firstGenerated.classList.add(`field-cell--${value1}`);
  secondGenerated.classList.add(`field-cell--${value2}`);

  firstGenerated.innerText = `${value1}`;
  secondGenerated.innerText = `${value2}`;

  messages.forEach(message => {
    message.className = 'message message-lose hidden';
  });
});

function cellNo(number) {
  return document.querySelector(`[data-num="${number}"]`);
}

function generateFreePlace() {
  const freeCellsCollection = cells.filter(cell => cell.innerText === '')
    .map(cell => cell.dataset.num);
  const randomPlace = Math.floor(Math.random() * freeCellsCollection.length);
  const freeCell
  = document.querySelector(`[data-num="${freeCellsCollection[randomPlace]}"]`);
  const freeCellValue = generateEven();

  freeCell.innerText = `${freeCellValue}`;
  freeCell.classList.add(`field-cell--${freeCellValue}`);
}

function mergeCells() {
  for (let n = 1; n <= 12; n++) {
    const valueUp = cellNo(n).innerText;

    if (cellNo(n).className === cellNo(n + 4).className
      && valueUp.length) {
      cellNo(n).innerText = `${2 * valueUp}`;
      score.innerText = `${Number(score.innerText) + 2 * valueUp}`;

      cellNo(n).className
      = `field-cell field-cell--${cellNo(n).innerText}`;
      cellNo(n + 4).innerText = '';
      cellNo(n + 4).className = 'field-cell';
    }
  }
}

function moveCells() {
  let count;

  do {
    count = 0;

    for (let n = 1; n <= 12; n++) {
      if (cellNo(n).innerText === ''
      && cellNo(n + 4).innerText.length !== 0) {
        cellNo(n).className = `${cellNo(n + 4).classList}`;
        cellNo(n).innerText = `${cellNo(n + 4).innerText}`;
        cellNo(n + 4).innerText = '';
        cellNo(n + 4).className = 'field-cell';
        count++;
      }
    }
  } while (count > 0);
}

function upCellsNum() {
  cells.forEach((cell, index) => {
    cell.dataset.num = `${index + 1}`;
  });
}

function downCellsNum() {
  cells.forEach((cell, index) => {
    cell.dataset.num = `${16 - index}`;
  });
}

function leftCellsNum() {
  let index = 0;

  for (let i = 0; i <= 3; i++) {
    rowsCollection.forEach(row => {
      row.children[i].dataset.num = `${index + 1}`;
      index++;
    });
  }
}

function rightCellsNum() {
  let index = 0;

  for (let i = 3; i >= 0; i--) {
    rowsCollection.forEach(row => {
      row.children[i].dataset.num = `${index + 1}`;
      index++;
    });
  }
}

document.addEventListener('keydown', (e) => {
  const dataBeforeClick = cells.map(cell => cell.innerText).toString();

  if (e.code === 'ArrowDown') {
    downCellsNum();
    moveCells();
    mergeCells();
  }

  if (e.code === 'ArrowUp') {
    upCellsNum();
    moveCells();
    mergeCells();
  }

  if (e.code === 'ArrowLeft') {
    leftCellsNum();
    moveCells();
    mergeCells();
  }

  if (e.code === 'ArrowRight') {
    rightCellsNum();
    moveCells();
    mergeCells();
  }

  const dataAfterClick = cells.map(cell => cell.innerText).toString();

  if (dataAfterClick !== dataBeforeClick) {
    generateFreePlace();
  }

  if (dataAfterClick === dataBeforeClick
    && cells.every(cell => cell.innerText !== '')) {
    messageLose.className = 'message message-lose';
  }

  if (score.innerText === '2048') {
    messageWin.classList.toggle('hidden');
  }
});
