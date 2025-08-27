'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function moveRowLeft(row) {
  let filledCells = row.filter((cell) => cell !== 0);

  for (let i = 0; i < filledCells.length; i++) {
    if (filledCells[i] === filledCells[i + 1]) {
      filledCells[i] *= 2;
      filledCells[i + 1] = 0;
      i++;
    }
  }

  filledCells = filledCells.filter((cell) => cell !== 0);

  while (filledCells.length !== 4) {
    filledCells.push(0);
  }

  return filledCells;
}

function moveRowRight(row) {
  let filledCells = row.filter((cell) => cell !== 0);

  for (let i = filledCells.length - 1; i >= 0; i--) {
    if (filledCells[i] === filledCells[i - 1]) {
      filledCells[i] *= 2;
      filledCells[i - 1] = 0;
      i--;
    }
  }

  filledCells = filledCells.filter((cell) => cell !== 0);

  while (filledCells.length !== 4) {
    filledCells.unshift(0);
  }

  return filledCells;
}

function isCellEmpty(cell) {
  return cell === 0;
}

function isFieldFull() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.board[i][j] === 0) {
        return false;
      }
    }
  }

  return true;
}

function getRandom(max, min) {
  const result = [];
  const rowIndex = Math.floor(Math.random() * (max - min + 1)) + min;
  const columnIndex = Math.floor(Math.random() * (max - min + 1)) + min;

  if (!isCellEmpty(game.board[rowIndex][columnIndex]) && !isFieldFull()) {
    return getRandom(max, min);
  }
  result.push(rowIndex);
  result.push(columnIndex);

  return result;
}

function spawnCell() {
  if (isFieldFull()) {
    return;
  }

  const [row, column] = getRandom(3, 0);

  if (row === undefined || column === undefined) {
    return;
  }

  const value = Math.random() < 0.9 ? 2 : 4;

  game.board[row][column] = value;
}

game.getState = function () {
  return this.board.map((row) => [...row]);
};

function renderBoard() {
  const state = game.getState();

  const rows = document.querySelectorAll('tr');

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      rows[i].children[j].className = `field-cell field-cell--${state[i][j]}`;
      rows[i].children[j].textContent = state[i][j] === 0 ? '' : state[i][j];
    }
  }
  displayScore();
}

function handleKeyArrow(e) {
  switch (e.key) {
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      break;
  }
}

function transport(matrix) {
  return matrix.map((_, c) => matrix.map((row) => row[c]));
}

function moveColumnUp(matrix) {
  const matrixTransported = transport(matrix);

  for (let i = 0; i < 4; i++) {
    matrixTransported[i] = moveRowLeft(matrixTransported[i]);
  }

  return transport(matrixTransported);
}

function moveColumnDown(matrix) {
  const matrixTransported = transport(matrix);

  for (let i = 0; i < 4; i++) {
    matrixTransported[i] = moveRowRight(matrixTransported[i]);
  }

  return transport(matrixTransported);
}

game.moveDown = function () {
  const resultMatrix = moveColumnDown(game.board);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      game.board[i][j] = resultMatrix[i][j];
    }
  }
  spawnCell();
  renderBoard();
  isGameWon();
  isGameOver();
};

game.moveUp = function () {
  const resultMatrix = moveColumnUp(game.board);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      game.board[i][j] = resultMatrix[i][j];
    }
  }
  spawnCell();
  renderBoard();
  isGameWon();
  isGameOver();
};

game.moveRight = function () {
  for (let i = 0; i < 4; i++) {
    game.board[i] = moveRowRight(game.board[i]);
  }
  spawnCell();
  renderBoard();
  isGameWon();
  isGameOver();
};

game.moveLeft = function () {
  for (let i = 0; i < 4; i++) {
    game.board[i] = moveRowLeft(game.board[i]);
  }
  spawnCell();
  renderBoard();
  isGameWon();
  isGameOver();
};

document.addEventListener('keydown', handleKeyArrow);

game.getScore = function () {
  const board = game.getState();
  let acc = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      acc += board[i][j];
    }
  }

  return acc;
};

function displayScore() {
  const scoreElement = document.querySelector('.game-score');
  const score = game.getScore();

  scoreElement.textContent = score;
}

game.start = function () {
  const startBtn = document.querySelector('.start');
  const messageStart = document.querySelector('.message-start');

  const handleClk = function () {
    game.status = 'playing';
    spawnCell();
    spawnCell();
    renderBoard();

    startBtn.className = 'button restart';
    startBtn.textContent = 'Restart';
    messageStart.classList.add('hidden');
    startBtn.removeEventListener('click', handleClk);
  };

  startBtn.addEventListener('click', handleClk);
};

game.restart = function () {
  const restartBtn = document.querySelector('.start');
  const state = game.board;
  const messages = document.querySelectorAll('.message');

  const handleClk = function () {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (state[i][j] !== 0) {
          state[i][j] = 0;
        }
      }
    }

    messages.forEach((message) => {
      if (!message.classList.contains('hidden')) {
        message.classList.add('hidden');
      }
    });

    spawnCell();
    spawnCell();
    renderBoard();
  };

  restartBtn.addEventListener('click', handleClk);
};

function isGameWon() {
  const board = game.board;
  const winMessage = document.querySelector('.message-win');

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 2048) {
        game.status = 'win';
        winMessage.classList.remove('hidden');

        return true;
      }
    }
  }

  return false;
}

function isMixPossible() {
  const state = game.board;
  const stateTransported = transport(state);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (state[i][j] === state[i][j + 1]) {
        return true;
      }

      if (stateTransported[i][j] === stateTransported[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
}

function isGameOver() {
  const loseMessage = document.querySelector('.message-lose');

  if (isFieldFull() && !isMixPossible()) {
    game.status = 'lose';
    loseMessage.classList.remove('hidden');

    return true;
  }

  return false;
  // actually do I need to put here 'return false'?
}

game.getStatus = function () {
  return this.status;
};

game.start();
game.restart();
