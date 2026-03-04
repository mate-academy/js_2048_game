'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

function renderBoard() {
  const cells = document.querySelectorAll('.field-cell');

  game
    .getState()
    .flat()
    .map((value, index) => {
      cells[index].className = 'field-cell';

      if (value > 0) {
        cells[index].classList.add(`field-cell--${value}`);
      }

      cells[index].textContent = value || '';

      if (value === 2048) {
        document
          .querySelector('.message.message-win')
          .classList.remove('hidden');
      }

      if (game.hasNoMoves()) {
        document
          .querySelector('.message.message-lose')
          .classList.remove('hidden');
      }
    });

  renderScore();
}

const button = document.querySelector('.button.start');

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    renderBoard();
    document.querySelector('.message.message-start').classList.add('hidden');
    button.classList.remove('start');
    button.textContent = 'Restart';
    button.classList.add('restart');
  } else {
    game.restart();
    renderBoard();
    document.querySelector('.message.message-start').classList.remove('hidden');
    document.querySelector('.message.message-win').classList.add('hidden');
    document.querySelector('.message.message-lose').classList.add('hidden');
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }
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

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowUp':
      game.moveUp();
      break;
  }

  renderBoard();
});

function renderScore() {
  document.querySelector('.game-score').textContent = game.getScore();
}
