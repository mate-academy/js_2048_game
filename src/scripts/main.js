'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game([
  [128, 128, 0, 8],
  [16, 8, 16, 32],
  [8, 16, 32, 64],
  [16, 32, 0, 128],
]);
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');
const board = document.querySelector('.game-field').tBodies[0];
const startButton = document.querySelector('.start');
let isStartButton = true;

startButton.addEventListener('click', () => {
  if (isStartButton) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    game.start();
  } else {
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
    game.restart();

    if (!winMessage.classList.contains('hidden')) {
      winMessage.classList.add('hidden');
    }

    if (!loseMessage.classList.contains('hidden')) {
      loseMessage.classList.add('hidden');
    }
  }

  if (!startMessage.classList.contains('hidden')) {
    startMessage.classList.add('hidden');
  }
  isStartButton = !isStartButton;
  boardRefresh();
});

document.body.addEventListener('keydown', (e) => {
  e.preventDefault();

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
  }

  boardRefresh();
});

function boardRefresh() {
  const gameState = game.getState();
  const boardSize = game.getBoardSize();

  score.textContent = game.getScore();

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = board.rows[i].children[j];
      const cellValue = gameState[i][j];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (cellValue !== 0) {
        cell.classList.add(`field-cell--${cellValue}`);
        cell.textContent = cellValue;
      }
    }
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}
