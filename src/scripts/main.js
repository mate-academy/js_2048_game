'use strict';

// Data
let score = 0;
const boardSize = 4;
const gameFieldValues = [];
let isWinLose = false;

// DOM elements
const body = document.body;
const gameButton = body.querySelector('.button');
const gameField = body.querySelector('.game-field');
const gameBody = gameField.querySelector('tbody');
const message = body.querySelector('.message-container');
const messageStart = message.querySelector('.message-start');
const messageWin = message.querySelector('.message-win');
const messageLose = message.querySelector('.message-lose');
const messageScore = body.querySelector('.game-score');

// DOM events
document.addEventListener('keydown', (e) => {
  if (isWinLose) {
    return;
  }

  if (e.defaultPrevented) {
    return;
  }

  switch (e.key) {
    case 'Up':
    case 'ArrowUp':
      makeColumnMove('up');
      break;
    case 'Down':
    case 'ArrowDown':
      makeColumnMove('down');
      break;
    case 'Left':
    case 'ArrowLeft':
      makeRowMove('left');
      break;
    case 'Right':
    case 'ArrowRight':
      makeRowMove('right');
      break;
    default:
      return;
  }

  e.preventDefault();
});

gameButton.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.innerText = 'Restart';
    messageStart.hidden = true;
  }

  initGameField();
});

// Game logic methods
function initGameField() {
  for (let i = 0; i < boardSize; i++) {
    gameFieldValues[i] = [];

    for (let j = 0; j < boardSize; j++) {
      gameFieldValues[i][j] = 0;
    }
  }
  score = 0;
  isWinLose = false;
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  for (let i = 0; i < 2; i++) {
    addNewElement();
  }
}

function addNewElement(isMove) {
  const row = Math.floor(Math.random() * gameFieldValues.length);
  const column = Math.floor(Math.random() * gameFieldValues[row].length);

  if (gameFieldValues[row][column] !== 0) {
    addNewElement(isMove);
  } else {
    gameFieldValues[row][column] = isMove
      ? Math.random() < 0.9 // 10% probability for 4 appear
        ? 2
        : 4
      : 2;
    redrawField();
    checkForGameOver();
  }
}

function redrawField() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cellValue = gameFieldValues[i][j];
      const cellNode = gameBody.rows[i].cells[j];

      cellNode.classList.remove(`field-cell--${cellNode.innerText}`);
      cellNode.innerText = '';

      if (cellValue) {
        cellNode.classList.add(`field-cell--${cellValue}`);
        cellNode.innerText = cellValue;
      }
    }
  }

  messageScore.innerText = score;
}

function checkForWin() {
  const result = gameFieldValues.reduce((pv, cv) => [...pv, ...cv]);

  if (result.includes(2048)) {
    isWinLose = true;
    messageWin.classList.remove('hidden');
  }
}

function checkForGameOver() {
  const result = gameFieldValues.reduce((pv, cv) => [...pv, ...cv]);

  if (!result.includes(0)) {
    isWinLose = true;
    messageLose.classList.remove('hidden');
  }
}

function makeRowMove(direction) {
  moveRow(direction);
  combineRow();
  moveRow(direction);
  addNewElement(true);
}

function makeColumnMove(direction) {
  moveColumn(direction);
  combineColumn();
  moveColumn(direction);
  addNewElement(true);
}

function moveRow(direction) {
  for (let i = 0; i < boardSize; i++) {
    const filtered = gameFieldValues[i].filter(item => item);
    const newRow = direction === 'left'
      ? filtered.concat(Array(boardSize - filtered.length).fill(0))
      : Array(boardSize - filtered.length).fill(0).concat(filtered);

    for (let j = 0; j < boardSize; j++) {
      gameFieldValues[i][j] = newRow[j];
    }
  }
}

function moveColumn(direction) {
  for (let i = 0; i < boardSize; i++) {
    const filtered = gameFieldValues.map(item => item[i]).filter(item => item);
    const newRow = direction === 'up'
      ? filtered.concat(Array(boardSize - filtered.length).fill(0))
      : Array(boardSize - filtered.length).fill(0).concat(filtered);

    for (let j = 0; j < boardSize; j++) {
      gameFieldValues[j][i] = newRow[j];
    }
  }
}

function combineRow() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize - 1; j++) {
      if (gameFieldValues[i][j] === 0) {
        continue;
      }

      if (gameFieldValues[i][j] === gameFieldValues[i][j + 1]) {
        const total = gameFieldValues[i][j] + gameFieldValues[i][j + 1];

        gameFieldValues[i][j] = total;
        gameFieldValues[i][j + 1] = 0;
        score += total;
      }
    }
  }

  checkForWin();
}

function combineColumn() {
  for (let i = 0; i < boardSize - 1; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (gameFieldValues[i][j] === 0) {
        continue;
      }

      if (gameFieldValues[i][j] === gameFieldValues[i + 1][j]) {
        const total = gameFieldValues[i][j] + gameFieldValues[i + 1][j];

        gameFieldValues[i][j] = total;
        gameFieldValues[i + 1][j] = 0;
        score += total;
      }
    }
  }

  checkForWin();
}
