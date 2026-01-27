'use strict';

import {
  looseMessage,
  setCells,
  startButton,
  startMessage,
  winMessage,
} from './utils/dom.constraints';

const Game = require('../modules/Game.class');
const game = new Game();

startButton.addEventListener('click', (e) => {
  startButton.classList = 'button restart';
  startButton.textContent = 'Reset';
  startMessage.classList.add('hidden');
  looseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  game.start();

  const boardCoords = game.getCellsCoordinates();

  setCells(boardCoords);
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') {
    const coords = game.moveUp();

    if (game.getStatus() === 'loose') {
      looseMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    }

    setCells(coords);
  }

  if (e.code === 'ArrowDown') {
    const coords = game.moveDown();

    if (game.getStatus() === 'loose') {
      looseMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    }

    setCells(coords);
  }

  if (e.code === 'ArrowRight') {
    const coords = game.moveRight();

    if (game.getStatus() === 'loose') {
      looseMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    }

    setCells(coords);
  }

  if (e.code === 'ArrowLeft') {
    const coords = game.moveLeft();

    if (game.getStatus() === 'loose') {
      looseMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    }

    setCells(coords);
  }
});
