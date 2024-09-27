'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const button = document.querySelector('.button');

button.addEventListener('click', (buttonEvent) => {
  buttonEvent.preventDefault();
  button.classList.toggle('start');
  button.classList.toggle('restart');

  if (game.getStatus() === Game.gameStatus.idle) {
    game.start();
    button.textContent = 'Restart';
  } else {
    game.restart();
    button.textContent = 'Start';
  }
  score.textContent = game.getScore();
  startMessage.classList.toggle('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
});

const score = document.querySelector('.game-score');

document.addEventListener('keydown', (keyEvent) => {
  if (game.getStatus() !== Game.gameStatus.playing) {
    return;
  }

  switch (keyEvent.key) {
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
  score.textContent = game.getScore();
  game.fillFreeCell();
  game.updateBorder();

  if (game.getStatus() === Game.gameStatus.lose) {
    loseMessage.classList.remove('hidden');
  }

  if (game.getStatus() === Game.gameStatus.win) {
    winMessage.classList.remove('hidden');
  }
});
