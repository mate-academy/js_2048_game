'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const scoreElement = document.querySelector('.game-score');

button.addEventListener('click', (ev) => {
  ev.preventDefault();

  if (button.classList.contains('start')) {
    game.start();
    updateTable(game.getState());

    button.classList.replace('start', 'restart');
    button.innerHTML = 'Restart';

    messageStart.classList.add('hidden');
  } else if (button.classList.contains('restart')) {
    game.restart();
    updateTable(game.getState());
    updateScore(game.getScore());
    winOrLose();

    button.classList.replace('restart', 'start');
    button.innerHTML = 'Start';

    messageStart.classList.remove('hidden');
  }
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() === 'playing') {
    switch (ev.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }
    updateTable(game.getState());
    updateScore(game.getScore());
    winOrLose();
  }
});

function updateTable(state) {
  const table = document.querySelector('.game-field');

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (state[i][j] === 0) {
        table.rows[i].cells[j].innerHTML = '';

        table.rows[i].cells[j].classList = 'field-cell';
      } else {
        table.rows[i].cells[j].innerHTML = state[i][j];

        table.rows[i].cells[j].classList =
          `field-cell field-cell--${state[i][j]}`;
      }
    }
  }
}

function updateScore(score) {
  scoreElement.innerHTML = score;
}

function winOrLose() {
  const result = game.checkWinOrLose();

  if (result === 'win') {
    messageWin.classList.remove('hidden');
  } else if (result === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}
