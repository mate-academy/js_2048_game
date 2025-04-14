'use strict';

const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const clear = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const gameTable = document.querySelector('.game-field');
const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const startMessage = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const scoreBar = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  game.start();
  game.modifyPage(gameTable, game.getState());

  startButton.hidden = true;
  restartButton.removeAttribute('hidden');
  startMessage.classList.add('hidden');
});

restartButton.addEventListener('click', () => {
  game.restart();
  game.modifyPage(gameTable, clear);
  scoreBar.textContent = game.getScore();

  restartButton.hidden = true;
  startButton.removeAttribute('hidden');
  startMessage.classList.remove('hidden');

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});

// #region Move for keyboard
document.addEventListener('keydown', (eventData) => {
  if (game.getStatus() === 'playing') {
    if (eventData.key === 'ArrowLeft') {
      game.moveLeft();
    } else if (eventData.key === 'ArrowRight') {
      game.moveRight();
    } else if (eventData.key === 'ArrowUp') {
      game.moveUp();
    } else if (eventData.key === 'ArrowDown') {
      game.moveDown();
    }

    game.modifyPage(gameTable, game.getState());
    scoreBar.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
    } else if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
    }
  }
});
// #endregion

// #region Move for touchscreen
let startPositionY;
let startPositionX;

document.addEventListener('touchstart', (eventData) => {
  startPositionY = eventData.changedTouches[0].clientY;
  startPositionX = eventData.changedTouches[0].clientX;
});

document.addEventListener('touchend', (data) => {
  if (game.getStatus() === 'playing') {
    const yDiff = data.changedTouches[0].clientY - startPositionY;
    const xDiff = data.changedTouches[0].clientX - startPositionX;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        game.moveRight();
      } else {
        game.moveLeft();
      }
    } else if (Math.abs(xDiff) < Math.abs(yDiff)) {
      if (yDiff > 0) {
        game.moveDown();
      } else {
        game.moveUp();
      }
    }
    game.modifyPage(gameTable, game.getState());
    scoreBar.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
    } else if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
    }
  }
});
// #endregion
