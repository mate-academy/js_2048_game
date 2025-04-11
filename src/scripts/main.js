'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const restartButton = document.createElement('button');
let gameIsRunning = false;

restartButton.textContent = 'Restart';
restartButton.classList.add('button', 'restart');

// const gameMessage = document.querySelector('.message-container');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const controls = document.querySelector('.controls');

// startButton.classList.add('restart');
// startButton.classList.add('button');
// startButton.textContent = 'Restart';

function updateButtonState(isGameRunning) {
  if (isGameRunning) {
    startButton.textContent = 'Pause';
    startButton.classList.add('paused');
    messageStart.classList.add('hidden');
  } else {
    startButton.textContent = 'Start';
    startButton.classList.remove('paused');
    messageStart.classList.remove('hidden');
  }
}

function startGame() {
  gameIsRunning = true;
  updateButtonState(gameIsRunning);
}

function pauseGame() {
  gameIsRunning = false;
  updateButtonState(gameIsRunning);
}

startButton.addEventListener('click', () => {
  if (gameIsRunning) {
    pauseGame();
  } else {
    startGame();
  }
});

startButton.addEventListener('click', () => {
  if (gameIsRunning) {
    updateButtonState(false);
  } else {
    updateButtonState(true);
  }
});
// Write your code here

startButton.addEventListener('click', () => {
  game.start();
  messageStart.classList.add('hidden');
  updateUI();
  startButton.remove();
  controls.append(restartButton);
});

restartButton.addEventListener('click', () => {
  game.restart();
  game.status = 'playing';
  updateUI();
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    default:
      return;
  }

  updateUI();
  updateGameMessage();
});

function updateGameMessage() {
  if (game.checkWin()) {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
  } else if (game.checkGameOver()) {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
  } else {
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
}

function updateUI() {
  const cells = document.querySelectorAll('.field-cell');

  if (game.board) {
    for (let i = 0; i < game.size; i++) {
      for (let j = 0; j < game.size; j++) {
        const cell = cells[i * game.size + j];
        const value = game.board[i][j];

        cell.textContent = value === 0 ? '' : value;
        cell.className = `field-cell field-cell--${value}`;
      }
    }
  }

  document.querySelector('.game-score').textContent = game.score;
}

if (game.board) {
  updateUI();
}
