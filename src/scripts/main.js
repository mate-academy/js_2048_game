'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const table = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function updateUIFiend() {
  for (let i = 0; i < game.field.length; i++) {
    for (let j = 0; j < game.field[i].length; j++) {
      if (game.field[i][j] !== 0) {
        table.rows[i].cells[j].innerText = game.field[i][j];
      } else {
        table.rows[i].cells[j].innerText = '';
      }

      if (game.field[i][j] !== game.prevField[i][j]) {
        const td = table.rows[i].cells[j];

        td.classList.remove(`field-cell--${game.prevField[i][j]}`);
        td.classList.add(`field-cell--${game.field[i][j]}`);
      }
    }
  }
}

button.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
    button.innerText = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    button.innerText = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.remove('hidden');
    score.innerText = game.score;
  }

  updateUIFiend();
});

document.addEventListener('keydown', (e) => {
  if (game.status === 'playing') {
    switch (e.key) {
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
  }

  if (game.status === 'lose') {
    messageStart.classList.add('hidden');
    messageLose.classList.remove('hidden');
  }

  if (game.status === 'win') {
    messageStart.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }

  score.innerText = game.score;
  updateUIFiend();
});
