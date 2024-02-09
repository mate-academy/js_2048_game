'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const page = document.querySelector('.page');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const board = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// eslint-disable-next-line no-shadow
button.addEventListener('click', (event) => {
  event.preventDefault();

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');

    game.start();
    game.colorCells(board);
  } else {
    if (!messageWin.classList.contains('hidden')) {
      messageWin.classList.add('hidden');
    }

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
    }

    game.restart();
    game.colorCells(board);
    score.textContent = game.getScore();
  }

  button.blur();
});

// eslint-disable-next-line no-shadow
page.addEventListener('keydown', (event) => {
  if (event.key.startsWith('Arrow') && event.repeat === false) {
    event.preventDefault();

    if (game.getStatus() === 'playing') {
      if (event.key === 'ArrowRight') {
        game.moveRight();
      } else if (event.key === 'ArrowLeft') {
        game.moveLeft();
      } else if (event.key === 'ArrowUp') {
        game.moveUp();
      } else if (event.key === 'ArrowDown') {
        game.moveDown();
      }

      game.colorCells(board);

      if (game.hasValue(0)) {
        game.generateTwoOrFour();
        game.colorCells(board);
      }
      score.textContent = game.getScore();

      if (game.getStatus() === 'win') {
        messageWin.classList.remove('hidden');
      }

      if (game.getStatus() === 'lose') {
        messageLose.classList.remove('hidden');
      }
    }
  }
});
