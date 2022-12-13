'use strict';

const gameField = document.querySelector('tbody');
const start = document.querySelector('.button');
const rowsQuantity = gameField.rows.length;
const cellsQuantity = gameField.rows[0].cells.length;
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const scoreField = document.querySelector('.game-score');
let isWin = false;
let score = 0;
let initialBoard;

function setUpBoard() {
  initialBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  scoreField.innerText = score;

  for (let i = 0; i < rowsQuantity; i++) {
    for (let j = 0; j < cellsQuantity; j++) {
      gameField.rows[i].cells[j].innerText
        = initialBoard[i][j] ? initialBoard[i][j] : '';
      gameField.rows[i].cells[j].classList.value = '';
      gameField.rows[i].cells[j].classList.add('field-cell');
    }
  }
}

function resetCell(cell, number) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (number > 0) {
    cell.innerText = number;
    cell.classList.add(`field-cell--${number}`);
  }
}

function checkIfEmpty() {
  for (let i = 0; i < rowsQuantity; i++) {
    for (let j = 0; j < cellsQuantity; j++) {
      if (initialBoard[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function checkIfSlide() {
  for (let i = 0; i < rowsQuantity; i++) {
    for (let j = 0; j < cellsQuantity - 1; j++) {
      if (initialBoard[i][j] === initialBoard[i][j + 1]
        || initialBoard[j][i] === initialBoard[j + 1][i]) {
        return true;
      }
    }
  }

  return false;
}

function getRandomCell() {
  if (!checkIfEmpty()) {
    return;
  }

  const min = 2;
  const max = 4;
  const interval = 2;
  let isZeroFound = false;

  while (!isZeroFound) {
    const x = Math.floor(Math.random() * 4);
    const y = Math.floor(Math.random() * 4);
    const number = Math.floor(Math.random()
      * (max - min + interval) / interval) * interval + min;

    if (initialBoard[x][y] === 0) {
      initialBoard[x][y] = number;
      resetCell(gameField.rows[x].cells[y], number);
      isZeroFound = true;

      return;
    }
  }
}

function updateBoard() {
  for (let i = 0; i < rowsQuantity; i++) {
    for (let j = 0; j < cellsQuantity; j++) {
      const gameCell = gameField.rows[i].cells[j];
      const number = initialBoard[i][j];

      resetCell(gameCell, number);
    }
  }
}

function createNewRow(row) {
  let newRow = row.filter(r => r !== 0);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  scoreField.innerText = score;
  newRow = newRow.filter(r => r !== 0);

  while (newRow.length < rowsQuantity) {
    newRow.push(0);
  }

  isWin = newRow.includes(2048);

  return newRow;
}

function goLeft() {
  for (let i = 0; i < rowsQuantity; i++) {
    let row = initialBoard[i];

    row = createNewRow(row);
    initialBoard[i] = row;
  }
  updateBoard();
}

function goRight() {
  for (let i = 0; i < rowsQuantity; i++) {
    let row = initialBoard[i];

    row.reverse();
    row = createNewRow(row);
    row.reverse();
    initialBoard[i] = row;
  }
  updateBoard();
}

function goUp() {
  for (let j = 0; j < cellsQuantity; j++) {
    let column = [];

    for (let i = 0; i < rowsQuantity; i++) {
      column.push(initialBoard[i][j]);
    }
    column = createNewRow(column);

    for (let k = 0; k < cellsQuantity; k++) {
      initialBoard[k][j] = column[k];
    }
  }
  updateBoard();
}

function goDown() {
  for (let j = 0; j < cellsQuantity; j++) {
    let column = [];

    for (let i = 0; i < rowsQuantity; i++) {
      column.push(initialBoard[i][j]);
    }
    column.reverse();
    column = createNewRow(column);
    column.reverse();

    for (let k = 0; k < cellsQuantity; k++) {
      initialBoard[k][j] = column[k];
    }
  }
  updateBoard();
}

function handleStartGame() {
  start.addEventListener('click', e => {
    if (start.innerText === 'Start') {
      isWin = false;
      score = 0;
      start.innerText = 'Restart';
      start.classList.replace('start', 'restart');
      messageStart.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageStart.classList.add('hidden');
      messageLose.classList.add('hidden');
      setUpBoard();
      getRandomCell();
      getRandomCell();
    } else {
      start.innerText = 'Start';
      start.classList.replace('restart', 'start');
      messageStart.classList.remove('hidden');
      setUpBoard();
    }
  });
}

function handleKeyControl() {
  document.addEventListener('keyup', e => {
    switch (e.key) {
      case 'ArrowLeft':
        goLeft();
        getRandomCell();
        break;
      case 'ArrowRight':
        goRight();
        getRandomCell();
        break;
      case 'ArrowUp':
        goUp();
        getRandomCell();
        break;
      case 'ArrowDown':
        goDown();
        getRandomCell();
        break;
      default:
        break;
    }

    if (isWin) {
      messageWin.classList.remove('hidden');
      start.innerText = 'Start';
      start.classList.replace('restart', 'start');
    }

    if (!checkIfEmpty() && !checkIfSlide()) {
      messageLose.classList.remove('hidden');
      start.innerText = 'Start';
      start.classList.replace('restart', 'start');
    }
  });
}

handleStartGame();
handleKeyControl();
