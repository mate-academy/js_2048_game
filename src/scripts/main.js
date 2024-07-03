'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const ARROW_KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

const updateScore = () => (gameScore.textContent = game.getScore());

button.addEventListener('click', activateGame);

function activateGame() {
  const isRestart = button.classList.toggle('restart');

  button.classList.toggle('start');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  gameScore.textContent = 0;

  if (isRestart) {
    button.textContent = 'Restart';
    game.start();
  } else {
    button.textContent = 'Start';
    game.restart();
  }

  document.addEventListener('keydown', move);
}

const deleteMove = () => document.removeEventListener('keydown', move);

function move(e) {
  if (game.getStatus() === Game.GAME_STATUS.playing) {
    let canMove = false;

    switch (e.key) {
      case ARROW_KEYS.LEFT:
        canMove = game.moveLeft();
        break;

      case ARROW_KEYS.RIGHT:
        canMove = game.moveRight();
        break;

      case ARROW_KEYS.UP:
        canMove = game.moveUp();
        break;

      case ARROW_KEYS.DOWN:
        canMove = game.moveDown();
        break;

      default:
        break;
    }

    if (canMove) {
      updateScore();
    }
  }

  if (game.getStatus() === Game.GAME_STATUS.lose) {
    messageLose.classList.remove('hidden');
    deleteMove();
  }

  if (game.getStatus() === Game.GAME_STATUS.win) {
    messageWin.classList.remove('hidden');
    deleteMove();
  }

  e.preventDefault();
}
