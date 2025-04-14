'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

const updateScore = () => (score.textContent = game.score);

button.addEventListener('click', () => {
  button.classList.toggle('restart');
  button.classList.toggle('start');
  startMessage.classList.toggle('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  score.textContent = 0;

  if (button.className.includes('start')) {
    button.textContent = 'Start';

    game.restart();
  }

  if (button.className.includes('restart')) {
    button.textContent = 'Restart';

    game.start();
  }

  document.addEventListener('keydown', move);
});

const deleteMove = () => document.removeEventListener('keydown', move);

function move(e) {
  if (game.getStatus() === Game.STATUS.playing) {
    let canMove = false;

    switch (e.key) {
      case 'ArrowLeft':
        canMove = game.moveLeft();
        break;
      case 'ArrowRight':
        canMove = game.moveRight();
        break;
      case 'ArrowUp':
        canMove = game.moveUp();
        break;
      case 'ArrowDown':
        canMove = game.moveDown();
        break;
      default:
        break;
    }

    if (canMove) {
      updateScore();
    }
  }

  if (game.getStatus() === Game.STATUS.lose) {
    loseMessage.classList.remove('hidden');

    deleteMove();
  }

  if (game.getStatus() === Game.STATUS.win) {
    winMessage.classList.remove('hidden');

    deleteMove();
  }

  e.preventDefault();
}

document.addEventListener('keydown', move);
