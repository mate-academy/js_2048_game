'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const gameScore = document.querySelector('.game-score');
const gameButton = document.querySelector('button');
const gameCells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateVisual() {
  gameScore.textContent = game.getScore();

  const flatBoard = game.getState().flat();

  gameCells.forEach((cell, index) => {
    const value = flatBoard[index];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  switch (game.getStatus()) {
    case 'win':
      messageStart.classList.add('hidden');
      messageLose.classList.add('hidden');
      messageWin.classList.remove('hidden');
      break;

    case 'lose':
      messageWin.classList.add('hidden');
      messageStart.classList.add('hidden');
      messageLose.classList.remove('hidden');
      break;

    case 'idle':
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
      messageStart.classList.remove('hidden');
      break;

    default:
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
      messageStart.classList.add('hidden');
  }
}

gameButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    gameButton.textContent = 'Restart';
    gameButton.classList.remove('start');
    gameButton.classList.add('restart');
  } else {
    game.restart();
  }

  updateVisual();
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

  updateVisual();
});
