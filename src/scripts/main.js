'use strict';

import Game from '../modules/Game.class';
// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');

const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const startBtn = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const cells = Array.from(document.querySelectorAll('.field-cell'));

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

const game = new Game(
  initialState,
  startBtn,
  scoreEl,
  cells,
  msgStart,
  msgWin,
  msgLose,
);

game.startBtn.addEventListener('click', () => game.start());

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;
  }
});
