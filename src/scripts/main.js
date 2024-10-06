'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');
const game = new Game();
// Write your code here

const GameStatus = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
};

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function startButtonUpdate() {
  scoreElement.textContent = game.score;
  startButton.textContent = 'Restart';
  startButton.classList.replace('start', 'restart');
  startMessage.classList.add('hidden');
}

function updateScore() {
  scoreElement.textContent = game.score;
}

function updateStatus() {
  if (game.status === GameStatus.WIN) {
    winMessage.classList.remove('hidden');
  } else if (game.status === GameStatus.LOSE) {
    loseMessage.classList.remove('hidden');
  }
}

function resetButtonUpdate() {
  scoreElement.textContent = '0';
  startButton.textContent = 'Start';
  startButton.classList.replace('restart', 'start');
  startMessage.classList.remove('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
}

function updateField() {
  const rows = document.querySelectorAll('.field-row');

  rows.forEach((element, rowIndex) => {
    const cells = element.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const value = game.state[rowIndex][cellIndex];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });
  });
}

startButton.addEventListener('click', () => {
  if (game.status === GameStatus.IDLE) {
    game.start();
    startButtonUpdate();
    updateField();
  } else {
    game.restart();
    resetButtonUpdate();
    updateField();
  }
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (game.status === GameStatus.IDLE
    || game.status === GameStatus.WIN
    || game.status === GameStatus.LOSE) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }
  game.getStatus();
  updateStatus();
  updateScore();
  updateField();
});
