'use strict';

const Game = require('../modules/Game.class');

export const game = new Game();

const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const gameScore = document.querySelector('.game-score');
const dialog = document.querySelector('.dialog');
const restartButton = document.getElementById('restart');
const cancelButton = document.getElementById('restart-cancel');

button.addEventListener('click', start);
document.addEventListener('keydown', control);

function start() {
  if (game.getStatus() === Game.STATUSES.idle) {
    game.start();
  } else {
    dialog.showModal();

    document.removeEventListener('keydown', control);

    restartButton.addEventListener('click', () => {
      game.restart();
      dialog.close();
      updateGame();
      document.addEventListener('keydown', control);
    });

    cancelButton.addEventListener('click', () => {
      dialog.close();
      document.addEventListener('keydown', control);
    });
  }

  updateGame();
}

function control(e) {
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

  updateGame();
}

function updateScore() {
  gameScore.textContent = game.getScore();
}

function updateGame() {
  updateGameField();
  updateMessage();
  updateButton();
  updateScore();
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

      cell.textContent = game.getState()[r][c] || '';
      cell.className = `field-cell field-cell--${game.getState()[r][c]}`;

      index++;
    }
  }
}
