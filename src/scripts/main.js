'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const flat = game.getState().flat();

  scoreElement.textContent = game.getScore();

  cells.forEach((el, i) => {
    const newValue = flat[i];
    const oldValue = el.textContent ? Number(el.textContent) : 0;

    el.className = 'field-cell';

    if (newValue > 0) {
      el.textContent = newValue;
      el.classList.add(`field-cell--${newValue}`);

      if (oldValue === 0) {
        el.classList.add('tile-new');
      } else if (oldValue !== newValue) {
        el.classList.add('tile-merge');
      }
    } else {
      el.textContent = '';
    }
  });

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

mainButton.addEventListener('click', (e) => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.textContent = 'Restart';
  } else {
    game.restart();
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      render();
      break;
    case 'ArrowRight':
      game.moveRight();
      render();
      break;
    case 'ArrowUp':
      game.moveUp();
      render();
      break;
    case 'ArrowDown':
      game.moveDown();
      render();
      break;
  }
});
