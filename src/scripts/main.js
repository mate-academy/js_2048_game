'use strict';

import Game from '../modules/Game.class.js';

const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const rows = document.querySelectorAll('.field-row');

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function updateTile(tile, num) {
  tile.textContent = '';
  tile.className = 'field-cell';

  if (num > 0) {
    tile.textContent = num;
    tile.classList.add('field-cell--' + num);
  }
}

function render() {
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      updateTile(rows[r].cells[c], state[r][c]);
    }
  }

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.className = 'button start';
  } else {
    button.textContent = 'Restart';
    button.className = 'button restart';
  }
}

document.addEventListener('keydown', (ev) => {
  switch (ev.key) {
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
  }

  ev.preventDefault();
  render();
});

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

render();
