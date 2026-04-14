'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const start = document.querySelector('.start');
  const cells = document.querySelectorAll('.field-row');
  const startMessage = document.querySelector('.message-start');
  const score = document.querySelector('.game-score');
  const winMessage = document.querySelector('.message-win');
  const losemessage = document.querySelector('.message-lose');
  let k = 1;

  start.addEventListener('click', () => {
    if (k % 2 !== 0) {
      game.start();
      render();

      start.textContent = 'Restart';
      start.classList.remove('start');
      start.classList.add('restart');
      k++;
      startMessage.classList.add('hidden');
    } else if (k % 2 === 0) {
      if (!losemessage.classList.contains('hidden')) {
        losemessage.classList.add('hidden');
      }
      game.restart();

      render();

      start.textContent = 'Start';
      start.classList.remove('restart');
      start.classList.add('start');
      k++;
      startMessage.classList.remove('hidden');
    }
  });

  function render() {
    const board = game.getState();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const number = board[i][j];
        const cell = cells[i].children[j];

        cell.textContent = number === 0 ? '' : number;
        cell.className = 'field-cell';

        if (number !== 0) {
          cell.classList.add(`field-cell--${number}`);
        }
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        score.textContent = game.getScore();
        statusMessage();
        break;
      case 'ArrowRight':
        game.moveRight();
        score.textContent = game.getScore();
        statusMessage();
        break;
      case 'ArrowUp':
        game.moveUp();
        score.textContent = game.getScore();
        statusMessage();
        break;
      case 'ArrowDown':
        game.moveDown();
        score.textContent = game.getScore();
        statusMessage();
        break;
      default:
        return;
    }

    render();
  });

  function statusMessage() {
    const statusGame = game.getStatus();

    if (statusGame === 'win') {
      winMessage.classList.remove('hidden');
    } else if (statusGame === 'lose') {
      losemessage.classList.remove('hidden');
    }
  }
});
