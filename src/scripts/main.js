'use strict';

import {
  looseMessage,
  setCells,
  startButton,
  startMessage,
  winMessage,
  gameScore,
} from './utils/dom.constraints';

const Game = require('../modules/Game.class');
const game = new Game();

function showMessage() {
  if (game.getStatus() === 'loose') {
    looseMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }
}

function gameEvents(coords) {
  showMessage();
  gameScore.textContent = game.getScore();

  setCells(coords);
}

startButton.addEventListener('click', (e) => {
  startButton.classList = 'button restart';
  startButton.textContent = 'Reset';
  game.resetScore();
  gameScore.textContent = game.getScore();
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

    gameEvents(coords);
  }

  if (e.code === 'ArrowDown') {
    const coords = game.moveDown();

    gameEvents(coords);
  }

  if (e.code === 'ArrowRight') {
    const coords = game.moveRight();

    gameEvents(coords);
  }

  if (e.code === 'ArrowLeft') {
    const coords = game.moveLeft();

    gameEvents(coords);
  }
});
