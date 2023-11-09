'use strict';

const cells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');
const gameMsgStart = document.querySelector('.message-start');
const gameMsgWin = document.querySelector('.message-win');
const gameMsgLose = document.querySelector('.message-lose');
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');
const fieldCells = [];
const width = 4;
let score = 0;

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function createInitialGameField() {
  for (let i = 0; i < width * width; i++) {
    cells[i].innerHTML = '0';
    fieldCells.push(cells[i]);
  }
}
createInitialGameField();

function startGame() {
  gameMsgStart.classList.add('hidden');
  startBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');

  generateNum();
  generateNum();
}

function restartGame() {
  score = 0;
  gameScore.innerHTML = '0';

  if (!gameMsgLose.classList.contains('hidden')) {
    gameMsgLose.classList.add('hidden');
  }

  if (!gameMsgWin.classList.contains('hidden')) {
    gameMsgLose.classList.add('hidden');
  }
  createInitialGameField();
  generateNum();
  generateNum();
}

function generateNum() {
  const randomNumber = Math.floor(Math.random() * fieldCells.length);

  if (fieldCells[randomNumber].innerHTML === '0') {
    fieldCells[randomNumber].innerHTML = Math.random() > 0.9 ? '4' : '2';
    applyColorStyles();
    checkForGameOver();
  } else {
    generateNum();
  }
}

function moveByHorizontalAxis(direction) {
  for (let i = 0; i < 16; i++) {
    if (!(i % 4)) {
      const firstCell = fieldCells[i].innerHTML;
      const secondCell = fieldCells[i + 1].innerHTML;
      const thirdCell = fieldCells[i + 2].innerHTML;
      const forthCell = fieldCells[i + 3].innerHTML;
      const row = [+firstCell, +secondCell, +thirdCell, +forthCell];

      const rowWithoutZero = row.filter(num => num);
      const missingCells = 4 - rowWithoutZero.length;
      const zeroCells = Array(missingCells).fill(0);

      const newRow = (direction === 'left')
        ? rowWithoutZero.concat(zeroCells)
        : zeroCells.concat(rowWithoutZero);

      fieldCells[i].innerHTML = newRow[0];
      fieldCells[i + 1].innerHTML = newRow[1];
      fieldCells[i + 2].innerHTML = newRow[2];
      fieldCells[i + 3].innerHTML = newRow[3];
    }
  }
  applyColorStyles();
}

function moveByVerticalAxis(direction) {
  for (let i = 0; i < 4; i++) {
    const firstCell = fieldCells[i].innerHTML;
    const secondCell = fieldCells[i + width].innerHTML;
    const thirdCell = fieldCells[i + (width * 2)].innerHTML;
    const forthCell = fieldCells[i + (width * 3)].innerHTML;
    const column = [+firstCell, +secondCell, +thirdCell, +forthCell];

    const columnWithoutZero = column.filter(num => num);
    const missingCells = 4 - columnWithoutZero.length;
    const zeroCells = Array(missingCells).fill(0);

    const newColumn = (direction === 'up')
      ? columnWithoutZero.concat(zeroCells)
      : zeroCells.concat(columnWithoutZero);

    fieldCells[i].innerHTML = newColumn[0];
    fieldCells[i + width].innerHTML = newColumn[1];
    fieldCells[i + (width * 2)].innerHTML = newColumn[2];
    fieldCells[i + (width * 3)].innerHTML = newColumn[3];
  }
  applyColorStyles();
}

function mergeCellsHorizontally() {
  for (let i = 0; i < 15; i++) {
    if (fieldCells[i].innerHTML === fieldCells[i + 1].innerHTML) {
      const total = +fieldCells[i].innerHTML + +fieldCells[i + 1].innerHTML;

      fieldCells[i].innerHTML = total;
      fieldCells[i + 1].innerHTML = '0';
      score += total;
      gameScore.innerHTML = score;
    }
  }
  checkWinCombination();
}

function mergeCellsVertically() {
  for (let i = 0; i < 12; i++) {
    if (fieldCells[i].innerHTML === fieldCells[i + width].innerHTML) {
      const total
          = +fieldCells[i].innerHTML + +fieldCells[i + width].innerHTML;

      fieldCells[i].innerHTML = total;
      fieldCells[i + width].innerHTML = 0;
      score += total;
      gameScore.innerHTML = score;
    }
  }
  checkWinCombination();
}

function assignByKeyCode({ keyCode }) {
  const fieldCellsValues = fieldCells.map(item => item.innerHTML);

  switch (keyCode) {
    case 37: moveLeft();
      break;
    case 38: moveUp();
      break;
    case 39: moveRight();
      break;
    case 40: moveDown();
      break;
    default: throw new Error('Wrong keyCode');
  }

  const isEqual = fieldCells.every((_, i) =>
    fieldCells[i].innerHTML === fieldCellsValues[i]);

  if (isEqual) {
    return;
  }

  generateNum();
}

document.addEventListener('keydown', assignByKeyCode);

function moveRight() {
  moveByHorizontalAxis('right');
  mergeCellsHorizontally();
  moveByHorizontalAxis('right');
}

function moveLeft() {
  moveByHorizontalAxis('left');
  mergeCellsHorizontally();
  moveByHorizontalAxis('left');
}

function moveUp() {
  moveByVerticalAxis('up');
  mergeCellsVertically();
  moveByVerticalAxis('up');
}

function moveDown() {
  moveByVerticalAxis('down');
  mergeCellsVertically();
  moveByVerticalAxis('down');
}

function checkWinCombination() {
  for (let i = 0; i < fieldCells.length; i++) {
    if (fieldCells[i].innerHTML === '2048') {
      gameMsgWin.classList.remove('hidden');
      document.removeEventListener('keydown', assignByKeyCode);
    }
  }
}

function checkForGameOver() {
  for (let i = 0; i < 15; i++) {
    if (fieldCells[i].innerHTML === fieldCells[i + 1].innerHTML) {
      return;
    }
  }

  for (let i = 0; i < 12; i++) {
    if (fieldCells[i].innerHTML === fieldCells[i + width].innerHTML) {
      return;
    }
  }

  let zeroCells = 0;

  for (let i = 0; i < fieldCells.length; i++) {
    if (fieldCells[i].innerHTML === '0') {
      zeroCells++;
    }
  }

  if (!zeroCells) {
    gameMsgLose.classList.remove('hidden');
    document.removeEventListener('keydown', assignByKeyCode);
  }
}

function applyColorStyles() {
  for (let i = 0; i < fieldCells.length; i++) {
    const currentCellValue = fieldCells[i];

    switch (currentCellValue.innerHTML) {
      case '0': currentCellValue.classList = 'field-cell';
        break;
      case '2': currentCellValue.classList = 'field-cell field-cell--2';
        break;
      case '4': currentCellValue.classList = 'field-cell field-cell--4';
        break;
      case '8': currentCellValue.classList = 'field-cell field-cell--8';
        break;
      case '16': currentCellValue.classList = 'field-cell field-cell--16';
        break;
      case '32': currentCellValue.classList = 'field-cell field-cell--32';
        break;
      case '64': currentCellValue.classList = 'field-cell field-cell--64';
        break;
      case '128': currentCellValue.classList = 'field-cell field-cell--128';
        break;
      case '256': currentCellValue.classList = 'field-cell field-cell--256';
        break;
      case '512': currentCellValue.classList = 'field-cell field-cell--512';
        break;
      case '1024': currentCellValue.classList = 'field-cell field-cell--1024';
        break;
      case '2048': currentCellValue.classList = 'field-cell field-cell--2048';
        break;
    }
  }
}
