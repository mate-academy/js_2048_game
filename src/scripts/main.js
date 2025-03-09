'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const gameScore = document.querySelector('.game-score');

function updateScore() {
  gameScore.textContent = game.getScore();
}

function updateButton() {
  if (game.getStatus() === Game.STATUSES.idle) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}

function updateMessage() {
  switch (game.getStatus()) {
    case Game.STATUSES.idle:
      messages.forEach((message) => {
        if (message.classList.contains('message-start')) {
          message.classList.remove('hidden');
        } else {
          message.classList.add('hidden');
        }
      });
      break;

    case Game.STATUSES.playing:
      messages.forEach((message) => message.classList.add('hidden'));
      break;

    case Game.STATUSES.win:
      messages.forEach((message) => {
        if (message.classList.contains('message-win')) {
          message.classList.remove('hidden');
        } else {
          message.classList.add('hidden');
        }
      });
      break;

    case Game.STATUSES.lose:
      messages.forEach((message) => {
        if (message.classList.contains('message-lose')) {
          message.classList.remove('hidden');
        } else {
          message.classList.add('hidden');
        }
      });
      break;
  }
}

function updateGameField() {
  const cells = document.querySelectorAll('.field-cell');
  let index = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = cells[index];

      cell.textContent = game.board[r][c] || '';
      cell.className = `field-cell field-cell--${game.board[r][c]}`;

      index++;
    }
  }
}

button.addEventListener('click', () => {
  if (game.status === Game.STATUSES.idle) {
    game.start();
  } else {
    game.restart();
  }

  updateGameField();
  updateMessage();
  updateButton();
  updateScore();
});

document.addEventListener('keydown', (e) => {
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

  updateGameField();
  updateMessage();
  updateButton();
  updateScore();
});
