'use strict';

import { setCells, startButton, startMessage } from './dom.constraints';

const Game = require('../modules/Game.class');
const game = new Game();

startButton.addEventListener('click', (e) => {
  startButton.classList = 'button restart';
  startButton.textContent = 'Reset';
  startMessage.classList.add('hidden');
  game.start();

  const boardCoords = game.getCellsCoordinates();

  setCells(boardCoords);
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') {
    const coords = game.moveUp();

    setCells(coords);
  }

  if (e.code === 'ArrowDown') {
    const coords = game.moveDown();

    setCells(coords);
  }

  if (e.code === 'ArrowRight') {
    const coords = game.moveRight();

    setCells(coords);
  }

  if (e.code === 'ArrowLeft') {
    const coords = game.moveLeft();

    setCells(coords);
  }
});
