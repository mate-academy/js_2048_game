'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const startMessage = document.querySelector('.message-start');
const scoreBar = document.querySelector('.game-score');

startButton.addEventListener('click', (eventData) => {
  game.start();

  startButton.hidden = true;
  restartButton.removeAttribute('hidden');
  startMessage.classList.add('hidden');
});

document.addEventListener('keydown', (eventData) => {
  if (eventData.key === 'ArrowLeft') {
    game.moveLeft();
    game.getRandomCell();
  } else if (eventData.key === 'ArrowRight') {
    game.moveRight();
    game.getRandomCell();
  } else if (eventData.key === 'ArrowUp') {
    game.moveUp();
    game.getRandomCell();
  } else if (eventData.key === 'ArrowDown') {
    game.moveDown();
    game.getRandomCell();
  }

  scoreBar.textContent = game.getScore();
});

// #region Move for touchscreen
let startPositionY;
let startPositionX;

document.addEventListener('touchstart', (eventData) => {
  if (startButton.hidden) {
    startPositionY = eventData.changedTouches[0].clientY;
    startPositionX = eventData.changedTouches[0].clientX;
  }
});

document.addEventListener('touchend', (data) => {
  const yDiff = data.changedTouches[0].clientY - startPositionY;
  const xDiff = data.changedTouches[0].clientX - startPositionX;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      game.moveRight();
      game.getRandomCell();
    } else {
      game.moveLeft();
      game.getRandomCell();
    }
  } else if (Math.abs(xDiff) < Math.abs(yDiff)) {
    if (yDiff > 0) {
      game.moveDown();
      game.getRandomCell();
    } else {
      game.moveUp();
      game.getRandomCell();
    }
  }
  scoreBar.textContent = game.getScore();
});
// #endregion
