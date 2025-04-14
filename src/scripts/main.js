'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

const updateScore = () => (gameScore.textContent = game.score);

button.addEventListener('click', activateGame);

function activateGame() {
  button.classList.toggle('restart');
  button.classList.toggle('start');
  messageStart.classList.toggle('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  gameScore.textContent = 0;

  if (button.className.includes('start')) {
    button.textContent = 'Start';

    game.restart();
  }

  if (button.className.includes('restart')) {
    button.textContent = 'Restart';

    game.start();
  }

  document.addEventListener('keydown', move);
}

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
    messageLose.classList.remove('hidden');

    deleteMove();
  }

  if (game.getStatus() === Game.STATUS.win) {
    messageWin.classList.remove('hidden');

    deleteMove();
  }

  e.preventDefault();
}

document.addEventListener('keydown', move);
