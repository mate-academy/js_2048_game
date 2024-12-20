'use strict';

const Game = require('../modules/Game.class');
const { updateCells, updateScore, updateStatus } = require('./domUtils.js');

const game = new Game();

const startBtn = document.querySelector('.start');
const fieldRows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const gameBest = document.querySelector('.game-best');
const messages = document.querySelector('.message-container').children;

const bestScore = localStorage.getItem('best');

if (bestScore) {
  gameBest.textContent = bestScore;
}

function updateAll() {
  updateCells(game, fieldRows);
  updateScore(game, gameScore, gameBest);
  updateStatus(game, messages);
}

document.addEventListener('keydown', (evt) => {
  if (game.getStatus() !== Game.Statuses.PLAYING) {
    return;
  }

  switch (evt.key) {
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
      return;
  }

  updateAll();
});

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    game.start();

    startBtn.classList.replace('start', 'restart');
    startBtn.textContent = 'Restart';
  } else if (startBtn.classList.contains('restart')) {
    game.restart();

    startBtn.classList.replace('restart', 'start');
    startBtn.textContent = 'Start';
  }
  updateAll();
});
