'use strict';
import Game from '../modules/Game.class.js';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();
const game = new Game();

// Write your code here
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

button.addEventListener('click', (e) => {
  if (button.textContent === 'Start') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    messageStart.classList.add('hidden');
    render();
  } else {
    game.restart();
    render();

    if (game.getStatus() === 'win') {
      messageWin.classList.add('hidden');
    }

    if (game.getStatus() === 'lose') {
      messageLose.classList.add('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }
  e.preventDefault();

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      render();
      break;

    case 'ArrowDown':
      game.moveDown();
      render();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      render();
      break;

    case 'ArrowRight':
      game.moveRight();
      render();
      break;
  }
});

function render() {
  const fieldGame = game.getState();
  const field = document.querySelector('tbody');

  fieldGame.forEach((row, i) => {
    row.forEach((value, j) => {
      const cell = field.rows[i].cells[j];

      cell.textContent = value > 0 ? value : '';
      cell.className = 'field-cell';
      cell.classList.add(`field-cell--${value}`);
    });
  });

  gameScore.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}
