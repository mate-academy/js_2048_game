'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const buttonStart = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

function updateScore() {
  score.textContent = game.score;
}

buttonStart.addEventListener('click', startGame);

function startGame() {
  buttonStart.classList.toggle('restart');
  buttonStart.classList.toggle('start');
  messageStart.classList.toggle('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  score.textContent = 0;

  if (buttonStart.className.includes('start')) {
    buttonStart.textContent = 'Start';

    game.restart();
  }

  if (buttonStart.className.includes('restart')) {
    buttonStart.textContent = 'Restart';

    game.start();
  }

  document.addEventListener('keydown', arrowMove);
}

const deleteMove = () => document.removeEventListener('keydown', arrowMove);

function arrowMove(action) {
  if (game.getStatus() === Game.STATUS.playing) {
    let canMove = false;

    switch (action.key) {
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

  action.preventDefault();
}

document.addEventListener('keydown', arrowMove);
