'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('.button.start');
const gameMessage = document.querySelector('.message.message-start');
const loseMessage = document.querySelector('.message.message-lose');
const winMessage = document.querySelector('.message.message-win');
const score = document.querySelector('.game-score');

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    score.innerText = game.score;
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
    score.innerText = game.score;
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
    score.innerText = game.score;
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
    score.innerText = game.score;
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
    gameMessage.classList.add('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
    gameMessage.classList.add('hidden');
  }
});

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    startButton.classList.replace('restart', 'start');
    startButton.innerHTML = 'Start';
    gameMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    score.innerText = 0;

    game.restart();
  } else {
    startButton.classList.replace('start', 'restart');
    startButton.innerHTML = 'Restart';
    game.start();
    gameMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }
});
