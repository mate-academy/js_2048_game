'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
});

function render() {
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');
  const flatBoard = board.flat();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const value = flatBoard[index];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  const startMessage = document.querySelector('.message-start');

  startMessage.classList.add('hidden');
  startButton.className = 'button restart';
  startButton.textContent = 'Restart';

  const winMessage = document.querySelector('.message-win');

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  const loseMessage = document.querySelector('.message-lose');

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  const scoreElement = document.querySelector('.game-score');

  if (scoreElement) {
    scoreElement.textContent = game.getScore();
  }
}

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
  }

  render();
});
