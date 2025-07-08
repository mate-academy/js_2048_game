'use strict';

const Game = require('../modules/Game.class');

const buttonEl = document.querySelector('.button');
const tableEl = document.querySelector('tbody');
const messagesEl = document.querySelectorAll('.message');
const scoreEl = document.querySelector('.game-score');

const game = new Game(buttonEl, tableEl, messagesEl, scoreEl);

buttonEl.addEventListener('click', () => {
  if (buttonEl.classList.contains('start')) {
    game.start();
  } else if (buttonEl.classList.contains('restart')) {
    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft(e.key);
  }

  if (e.key === 'ArrowRight') {
    game.moveRight(e.key);
  }

  if (e.key === 'ArrowUp') {
    game.moveUp(e.key);
  }

  if (e.key === 'ArrowDown') {
    game.moveDown(e.key);
  }
});
