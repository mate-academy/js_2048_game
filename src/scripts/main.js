'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  game.start();

  messageStart.classList.add('hidden');

  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
});

restartButton.addEventListener('click', () => {
  game.restart();

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
});

document.addEventListener('keydown', (ev) => {
  let moved = false;

  switch (ev.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    if (game.checkWin()) {
      messageWin.classList.remove('hidden');
    }

    game.addRandomTile();

    if (game.isGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }

  game.render();
  gameScore.textContent = game.getScore();
});
