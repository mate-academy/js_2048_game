'use strict';

const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

const gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rows = 4;
const cells = 4;
let score = 0;

function appendDigit() {
  return Math.round(Math.random()) < 0.1 ? 4 : 2;
}

function getRandomIndex() {
  return Math.floor(Math.random() * 4);
}

function resetBoard() {
  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < cells; cell++) {
      gameBoard[row][cell] = 0;
    }
  }
}

startButton.addEventListener('click', (buttonEvent) => {
  resetBoard();
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  startButton.classList.remove('start');
  buttonEvent.target.classList.add('restart');
  startButton.innerHTML = 'Restart';

  document.addEventListener('keyup', () => {});

  appendTile();
  appendTile();

  renderBoard();
});

function hasEmptyTile() {
  return gameBoard.some(row => row.some(cell => cell === 0));
}

function appendTile() {
  if (hasEmptyTile()) {
    let rowIndex, cellIndex;

    do {
      rowIndex = getRandomIndex();
      cellIndex = getRandomIndex();
    } while (gameBoard[rowIndex][cellIndex] !== 0);

    gameBoard[rowIndex][cellIndex] = appendDigit();
  } else {
    return null;
  }
}

function updateTile(tile, cellValue) {
  tile.innerHTML = '';
  tile.className = '';
  tile.classList.add('field-cell');

  if (cellValue > 0) {
    tile.classList.add(`field-cell--${cellValue}`);
    tile.innerHTML = cellValue;
    score += cellValue;
  }

  updateScore();
};

function updateScore() {
  gameScore.innerHTML = score;
}

function renderBoard() {
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let cellIndex = 0; cellIndex < cells; cellIndex++) {
      const tile = gameField.rows[rowIndex].cells[cellIndex];
      const cellValue = gameBoard[rowIndex][cellIndex];

      updateTile(tile, cellValue);
    }
  }
}
