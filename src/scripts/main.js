'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const buttonStartGame = document.querySelector('.button');
const showStartMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const totalScore = document.querySelector('.game-score');

function updateScore() {
  totalScore.textContent = game.score;
}

buttonStartGame.addEventListener('click', startGame);

function startGame() {
  buttonStartGame.classList.toggle('restart');
  buttonStartGame.classList.toggle('start');
  showStartMessage.classList.toggle('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  totalScore.textContent = 0;

  if (buttonStartGame.className.includes('start')) {
    buttonStartGame.textContent = 'Start';

    game.restart();
  }

  if (buttonStartGame.className.includes('restart')) {
    buttonStartGame.textContent = 'Restart';

    game.start();
  }

  document.addEventListener('keydown', arrowMove);
}

const deleteMove = () => document.removeEventListener('keydown', arrowMove);

function arrowMove(action) {
  if (game.getStatus() === Game.STATUS.playing) {
    let hasMoved = false;

    switch (action.key) {
      case 'ArrowLeft':
        hasMoved = game.moveLeft();
        break;
      case 'ArrowRight':
        hasMoved = game.moveRight();
        break;
      case 'ArrowUp':
        hasMoved = game.moveUp();
        break;
      case 'ArrowDown':
        hasMoved = game.moveDown();
        break;
      default:
        break;
    }

    if (hasMoved) {
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

  action.preventDefault();
}

document.addEventListener('keydown', arrowMove);
