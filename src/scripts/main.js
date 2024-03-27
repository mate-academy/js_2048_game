/* eslint-disable no-inner-declarations */
'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const fieldRows = document.querySelectorAll('.field-row');

const rowsArr = [...fieldRows];

const gameScore = document.querySelector('.game-score');

gameScore.innerText = 0;

const gameField = document.querySelector('.game-field');

let gameOver = 0;

const cells = document.querySelectorAll('.field-cell');
const cellsArr = [...cells];

const columnsArr = [];

for (let i = 0; i <= 3; i++) {
  const column = [];

  for (let j = i; j <= cellsArr.length - 1; j += 4) {
    column.push(cellsArr[j]);
  }

  columnsArr.push(column);
}

function randomNumber(start, end) {
  const number = start + Math.ceil(Math.random() * end - start);

  return number;
}

function chooseNumber() {
  const number = randomNumber(1, 10);

  if (number === 1) {
    return 4;
  }

  return 2;
}

function chooseCell() {
  let fieldCellNumber = randomNumber(1, 16);

  let fieldCell = document.querySelector(`.field-cell--n${fieldCellNumber}`);

  while (!(fieldCell.innerText === '')) {
    fieldCellNumber = 1 + Math.ceil(Math.random() * 15);

    fieldCell = document.querySelector(`.field-cell--n${fieldCellNumber}`);
  }

  return fieldCell;
}

function colorCells() {
  const cellList = document.querySelectorAll('.field-cell');

  const cellArr = [...cellList];

  cellArr.forEach((cell) => {
    if (cell.innerText === '') {
      for (let i = 2; i <= 2048; i *= 2) {
        if (cell.classList.contains(`field-cell--${i}`)) {
          cell.classList.remove(`field-cell--${i}`);
        }
      }
      cell.classList.add('field-cell--0');
    } else {
      if (cell.classList.contains(`field-cell--0`)) {
        cell.classList.remove(`field-cell--0`);
      }

      for (let i = 2; i <= 2048; i *= 2) {
        if (cell.classList.contains(`field-cell--${i}`)) {
          cell.classList.remove(`field-cell--${i}`);
        }
      }
      cell.classList.add(`field-cell--${cell.innerText}`);
    }
  });
}

function addNewNumber() {
  const cellContent = chooseNumber();

  const fieldCell1 = chooseCell();

  setTimeout(() => {
    fieldCell1.classList.add(`field-cell--${cellContent}`);
    fieldCell1.innerText = cellContent;
  }, 100);
}

function emptyCellCheckRightAndDown(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    if (arr[i].innerText === '') {
      arr[i].innerText = arr[i - 1].innerText;
      arr[i - 1].innerText = '';
    } else {
      continue;
    }
  }
}

function emptyCellCheckLeftAndUp(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].innerText === '') {
      arr[i].innerText = arr[i + 1].innerText;
      arr[i + 1].innerText = '';
    } else {
      continue;
    }
  }
}

function emptyCellInRowOrColumnCheck(arr, keyCode) {
  const arrOfvalues = [];

  for (const ch of arr) {
    arrOfvalues.push(ch.innerText);
  }

  if (!arrOfvalues.includes('')) {
    return;
  }

  if (keyCode === 'ArrowRight' || keyCode === 'ArrowDown') {
    emptyCellCheckRightAndDown(arr);
    emptyCellCheckRightAndDown(arr);
  }

  if (keyCode === 'ArrowLeft' || keyCode === 'ArrowUp') {
    emptyCellCheckLeftAndUp(arr);
    emptyCellCheckLeftAndUp(arr);
  }
}

function emptyCellCheck() {
  let count = 0;

  for (const ch of rowsArr) {
    for (let i = 0; i < 3; i++) {
      if (
        ch.children[i].innerText !== ch.children[i + 1].innerText
        && ch.children[i].innerText !== ''
        && ch.children[i + 1].innerText !== ''
      ) {
        count++;
      }
    }
  }

  for (const ch of columnsArr) {
    for (let i = 0; i < 3; i++) {
      if (
        ch[i].innerText !== ch[i + 1].innerText
        && ch[i].innerText !== ''
        && ch[i + 1].innerText !== ''
      ) {
        count++;
      }
    }
  }

  const innerTextArr = cellsArr.map((cell) => cell.innerText);

  if (count === 24) {
    messageLose.classList.remove('hidden');
    gameField.classList.add('game-over');
    gameOver++;
  }

  if (innerTextArr.includes('2048')) {
    messageWin.classList.remove('hidden');
    gameField.classList.add('game-over');
    gameOver++;
  }

  if (gameOver > 0 && count === 24) {
    gameField.classList.add('game-over');
    messageLose.classList.remove('hidden');
  }
}

function clearCells() {
  cellsArr.forEach(cell => {
    cell.innerText = '';
  });
  colorCells();
}

colorCells();

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.innerText = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    messageStart.classList.add('hidden');
    addNewNumber();
    addNewNumber();

    return;
  }

  if (button.classList.contains('restart')) {
    clearCells();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    gameField.classList.remove('game-over');
    gameScore.innerText = 0;
    gameOver = 0;
    addNewNumber();
    addNewNumber();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight') {
    if (gameOver > 0) {
      return;
    }

    const numbersArrBefore = cellsArr.map((cell) => cell.innerText);

    for (const ch of rowsArr) {
      for (let i = ch.children.length - 1; i > 0; i--) {
        emptyCellInRowOrColumnCheck(ch.children, e.code);

        if (
          ch.children[i].innerText === ch.children[i - 1].innerText
          && ch.children[i].innerText !== ''
        ) {
          ch.children[i].innerText = `${
            +ch.children[i].innerText + +ch.children[i - 1].innerText
          }`;
          ch.children[i - 1].innerText = '';

          gameScore.innerText
            = +gameScore.innerText + +ch.children[i].innerText;
        } else {
          continue;
        }
      }
      colorCells();
    }

    const numbersArrAfter = cellsArr.map((cell) => cell.innerText);

    if (
      JSON.stringify(numbersArrBefore) !== JSON.stringify(numbersArrAfter)
      && gameOver === 0
    ) {
      addNewNumber();
    }

    setTimeout(() => {
      emptyCellCheck();
    }, 100);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowDown') {
    if (gameOver > 0) {
      return;
    }

    const numbersArrBefore = cellsArr.map((cell) => cell.innerText);

    for (const ch of columnsArr) {
      for (let i = ch.length - 1; i > 0; i--) {
        emptyCellInRowOrColumnCheck(ch, e.code);

        if (ch[i].innerText === ch[i - 1].innerText && ch[i].innerText !== '') {
          ch[i].innerText = `${+ch[i].innerText + +ch[i - 1].innerText}`;
          ch[i - 1].innerText = '';

          gameScore.innerText = +gameScore.innerText + +ch[i].innerText;
        } else {
          continue;
        }
      }
      colorCells();
    }

    const numbersArrAfter = cellsArr.map((cell) => cell.innerText);

    if (
      JSON.stringify(numbersArrBefore) !== JSON.stringify(numbersArrAfter)
      && gameOver === 0
    ) {
      addNewNumber();
    }

    setTimeout(() => {
      emptyCellCheck();
    }, 100);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    if (gameOver > 0) {
      return;
    }

    const numbersArrBefore = cellsArr.map((cell) => cell.innerText);

    for (const ch of rowsArr) {
      for (let i = 0; i < ch.children.length - 1; i++) {
        emptyCellInRowOrColumnCheck(ch.children, e.code);

        if (
          ch.children[i].innerText === ch.children[i + 1].innerText
          && ch.children[i].innerText !== ''
        ) {
          ch.children[i].innerText = `${
            +ch.children[i + 1].innerText + +ch.children[i].innerText
          }`;
          ch.children[i + 1].innerText = '';

          gameScore.innerText
            = +gameScore.innerText + +ch.children[i].innerText;
        } else {
          continue;
        }
      }
      colorCells();
    }

    const numbersArrAfter = cellsArr.map((cell) => cell.innerText);

    if (
      JSON.stringify(numbersArrBefore) !== JSON.stringify(numbersArrAfter)
      && gameOver === 0
    ) {
      addNewNumber();
    }

    setTimeout(() => {
      emptyCellCheck();
    }, 100);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp') {
    if (gameOver > 0) {
      return;
    }

    const numbersArrBefore = cellsArr.map((cell) => cell.innerText);

    for (const ch of columnsArr) {
      for (let i = 0; i < ch.length - 1; i++) {
        emptyCellInRowOrColumnCheck(ch, e.code);

        if (ch[i].innerText === ch[i + 1].innerText && ch[i].innerText !== '') {
          ch[i].innerText = `${+ch[i + 1].innerText + +ch[i].innerText}`;
          ch[i + 1].innerText = '';

          gameScore.innerText = +gameScore.innerText + +ch[i].innerText;
        } else {
          continue;
        }
      }
      colorCells();
    }

    const numbersArrAfter = cellsArr.map((cell) => cell.innerText);

    if (
      JSON.stringify(numbersArrBefore) !== JSON.stringify(numbersArrAfter)
      && gameOver === 0
    ) {
      addNewNumber();
    }

    setTimeout(() => {
      emptyCellCheck();
    }, 100);
  }
});
