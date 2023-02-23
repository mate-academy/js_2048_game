'use strict';

const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const startRestartButton = document.querySelector('.start');
const startGameMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const rows = 4;
const cells = 4;
let score = 0;

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startRestartButton.addEventListener('click', (e) => {
  clearBoard();
  startGameMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  e.target.classList.remove('start');
  e.target.classList.add('restart');
  e.target.textContent = 'Restart';

  document.addEventListener('keyup', keyUpHandler);

  addNumber();
  addNumber();

  updateGameField();
});

function updateScore() {
  gameScore.textContent = score;
}

function checkForWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cells; c++) {
      if (board[r][c] >= 2048) {
        return true;
      }
    }
  }
}

function clearBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cells; c++) {
      board[r][c] = 0;
    }
  }

  score = 0;
  updateScore();
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
}

function getRandomIndex() {
  return Math.round(Math.random() * 3);
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cells; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addNumber() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const rowIndex = getRandomIndex();
    const cellIndex = getRandomIndex();

    if (!board[rowIndex][cellIndex]) {
      board[rowIndex][cellIndex] = getRandomNumber();
      found = true;
    }
  }
}

function updateGameField() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cells; c++) {
      const tile = gameField.rows[r].cells[c];
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.classList.add(`field-cell--${num}`);
    tile.innerText = num;
  }
}

function keyUpHandler(e) {
  switch (e.code) {
    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;

    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;
  }

  updateGameField();

  if (checkForWin()) {
    winMessage.classList.remove('hidden');
    endGameHandler();
  }

  if (!hasEmptyTile()) {
    loseMessage.classList.remove('hidden');
    endGameHandler();
  }

  addNumber();
  updateScore();
}

function endGameHandler() {
  document.removeEventListener('keyup', keyUpHandler);
  startRestartButton.classList.remove('restart');
  startRestartButton.classList.add('start');
  startRestartButton.textContent = 'Start';
}

function filterZeros(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let filteredRow = filterZeros(row);

  if (new Set(filteredRow).length !== filteredRow.length) {
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        score += filteredRow[i];
      }
    }

    filteredRow = filterZeros(filteredRow);
  }

  while (filteredRow.length < cells) {
    filteredRow.push(0);
  }

  return filteredRow;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;
  }

  updateGameField();
};

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;
  }

  updateGameField();
}

function slideUp() {
  for (let c = 0; c < cells; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];
  }
}

function slideDown() {
  for (let c = 0; c < cells; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    board[3][c] = row[0];
    board[2][c] = row[1];
    board[1][c] = row[2];
    board[0][c] = row[3];
  }
}
