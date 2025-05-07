'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button');
const scoreButton = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  if (startButton.getAttribute('class') === 'button start') {
    startButton.setAttribute('class', 'button restart');
    startButton.textContent = 'Restart';
    startMessage.style = 'display: none';
    game.start();
  } else {
    // startButton.setAttribute('class', 'button start');
    // startButton.textContent = 'Start';
    loseMessage.setAttribute('class', 'message message-lose hidden');
    game.restart();
  }

  game.getState();
  game.getStatus();
  scoreButton.textContent = game.getScore();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();

        break;
      case 'ArrowRight':
        game.moveRight();

        break;
      case 'ArrowUp':
        game.moveUp();

        break;
      case 'ArrowDown':
        game.moveDown();

        break;
    }

    game.getState();

    if (game.getStatus() === 'win') {
      document
        .querySelector('.message-win')
        .setAttribute('class', 'message message-win');
    } else if (game.getStatus() === 'lose') {
      document
        .querySelector('.message-lose')
        .setAttribute('class', 'message message-lose');
    }

    scoreButton.textContent = game.getScore();
  }
});
