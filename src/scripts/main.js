'use strict';

const tableBody = document.querySelector('tbody');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const messageContainer = document.querySelector('.message-container');

let gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
let gameStarted = false;
let gameWon = false;

document.addEventListener('keydown', handleKeyPress);

function checkGameOver() {
  for (let row = 0; row < gameBoard.length; row++) {
    for (let column = 0; column < gameBoard[row].length; column++) {
      if (gameBoard[row][column] === 0) {
        return;
      }

      if (column < gameBoard[row].length - 1
        && gameBoard[row][column] === gameBoard[row][column + 1]) {
        return;
      }

      if (row < gameBoard.length - 1
        && gameBoard[row][column] === gameBoard[row + 1][column]) {
        return;
      }
    }
  }

  loseMessage.classList.remove('hidden');
}

function checkGameWin() {
  const result = gameBoard.some(row => row.some(tile => tile === 2048));

  if (result) {
    gameWon = true;
  }
}

function moveRight() {
  let moved = false;

  for (let row = 0; row < gameBoard.length; row++) {
    for (let column = 1; column < gameBoard[row].length; column++) {
      const currentTile = gameBoard[row][column];
      const nextTile = gameBoard[row][column - 1];

      if (nextTile > 0) {
        if (currentTile === 0) {
          gameBoard[row][column] = nextTile;
          gameBoard[row][column - 1] = 0;
          column = -1;
          moved = true;
        } else if (currentTile === nextTile) {
          gameBoard[row][column] *= 2;
          gameBoard[row][column - 1] = 0;
          score += gameBoard[row][column];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateRandomTile();
  }
}

function moveLeft() {
  let moved = false;

  for (let row = 0; row < gameBoard.length; row++) {
    for (let column = gameBoard[row].length - 1; column >= 0; column--) {
      const currentTile = gameBoard[row][column];
      const nextTile = gameBoard[row][column + 1];

      if (nextTile > 0) {
        if (currentTile === 0) {
          gameBoard[row][column] = nextTile;
          gameBoard[row][column + 1] = 0;
          column = gameBoard[row].length;
          moved = true;
        } else if (currentTile === nextTile) {
          gameBoard[row][column] *= 2;
          gameBoard[row][column + 1] = 0;
          score += gameBoard[row][column];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateRandomTile();
  }
}

function moveUp() {
  let moved = false;

  for (let column = 0; column < gameBoard[0].length; column++) {
    for (let row = 0; row < gameBoard.length - 1; row++) {
      const currentTile = gameBoard[row][column];
      const nextTile = gameBoard[row + 1][column];

      if (nextTile > 0) {
        if (currentTile === 0) {
          [gameBoard[row][column], gameBoard[row + 1][column]] = [nextTile, 0];
          row = -1;
          moved = true;
        } else if (currentTile === nextTile) {
          gameBoard[row][column] *= 2;
          gameBoard[row + 1][column] = 0;
          score += gameBoard[row][column];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateRandomTile();
  }
}

function moveDown() {
  let moved = false;

  for (let column = 0; column < gameBoard[0].length; column++) {
    for (let row = gameBoard.length - 1; row > 0; row--) {
      const currentTile = gameBoard[row][column];
      const nextTile = gameBoard[row - 1][column];

      if (nextTile > 0) {
        if (currentTile === 0) {
          gameBoard[row][column] = nextTile;
          gameBoard[row - 1][column] = 0;
          row = gameBoard.length;
          moved = true;
        } else if (currentTile === nextTile) {
          gameBoard[row][column] *= 2;
          gameBoard[row - 1][column] = 0;
          score += gameBoard[row][column];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateRandomTile();
  }
}

function generateRandomTile() {
  let randomRow = Math.floor(Math.random() * 4);
  let randomColumn = Math.floor(Math.random() * 4);

  while (gameBoard[randomRow][randomColumn] !== 0) {
    randomRow = Math.floor(Math.random() * 4);
    randomColumn = Math.floor(Math.random() * 4);
  }

  const number = Math.random() < 0.1 ? 4 : 2;

  gameBoard[randomRow][randomColumn] = number;
}

function handleKeyPress(ev) {
  if (gameStarted) {
    switch (ev.key) {
      case 'ArrowUp':
        moveUp();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
    }
  }

  render();
}

startButton.addEventListener('click', () => {
  if (!gameStarted) {
    // Начало игры
    gameStarted = true;
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    generateRandomTile();
    generateRandomTile();
  } else {
    gameStarted = false;
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');

    gameBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    score = 0;
    gameWon = false;
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  render();
});

const render = () => {
  scoreDisplay.innerHTML = `<span class="game-score">${score}</span>`;
  tableBody.innerHTML = '';

  for (let i = 0; i < gameBoard.length; i++) {
    const row = document.createElement('tr');

    row.classList.add('field-row');

    for (let j = 0; j < gameBoard[i].length; j++) {
      const cellValue = gameBoard[i][j];
      const cell = document.createElement('td');

      cell.textContent = cellValue === 0 ? '' : cellValue;
      cell.classList.add('field-cell');

      if (cellValue !== 0) {
        cell.classList.add(`field-cell--${cellValue}`);
      }

      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }

  checkGameOver();
  checkGameWin();
  winMessage.classList.toggle('hidden', !gameWon);

  if (!gameStarted) {
    messageContainer.appendChild(startMessage);
  } else if (messageContainer.contains(startMessage)) {
    messageContainer.removeChild(startMessage);
  }
};
