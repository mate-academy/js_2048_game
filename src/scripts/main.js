'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function renderGame() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();
  let cellIndex = 0;

  for (const row of state) {
    for (const value of row) {
      const cell = cells[cellIndex];

      cell.className = 'field-cell';

      if (value === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
      cellIndex++;
    }
  }
  scoreElement.textContent = score;

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  if (gameStatus === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

renderGame();

startButton.addEventListener('click', (clickEvent) => {
  if (clickEvent.target.classList.contains('start')) {
    game.start();
    renderGame();
  } else if (clickEvent.target.classList.contains('restart')) {
    game.restart();
    renderGame();
  }
});

document.addEventListener('keydown', (keyEvent) => {
  if (game.getStatus() === 'playing') {
    switch (keyEvent.key) {
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
    renderGame();
  }
});
