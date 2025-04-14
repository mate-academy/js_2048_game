'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('keydown', (even) => {
  switch (even.key) {
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
});

const buttonStart = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageRestart = document.querySelector('.message-restart');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    buttonStart.textContent = 'Restart';
    game.start();
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageRestart.classList.remove('hidden');
  } else {
    buttonStart.textContent = 'Start';
    game.restart();
    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    messageRestart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');
  }
});
