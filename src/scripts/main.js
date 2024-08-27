'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

button.addEventListener('click', startGame);

function startGame() {
  if (game.status === Game.STATUS.idle) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    startMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  } else {
    game.restart();
    score.textContent = game.getScore();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }

  document.addEventListener('keydown', handleKey);

  if (game.status !== Game.STATUS.playing) {
    document.removeEventListener('keydown', handleKey);
  }
}

function handleKey(e) {
  e.preventDefault();

  switch (e.key) {
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

    default:
      break;
  }

  score.textContent = game.getScore();

  if (game.getStatus() === Game.STATUS.lose) {
    loseMessage.classList.remove('hidden');
  } else if (game.getStatus() === Game.STATUS.win) {
    winMessage.classList.remove('hidden');
  }

  game.checkMovesAvailable();
}
