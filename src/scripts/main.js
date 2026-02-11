'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let gameIsActive = false;

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    game.start();
    gameIsActive = true;
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
    switchStatus();
  } else {
    game.restart();
    switchStatus();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && gameIsActive) {
    e.preventDefault();
    game.moveLeft();
    switchStatus();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && gameIsActive) {
    e.preventDefault();
    game.moveRight();
    switchStatus();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' && gameIsActive) {
    e.preventDefault();
    game.moveDown();
    switchStatus();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && gameIsActive) {
    e.preventDefault();
    game.moveUp();
    switchStatus();
  }
});

function switchStatus() {
  switch (game.getStatus()) {
    case 'idle':
      break;

    case 'win':
      messageWin.classList.remove('hidden');
      break;

    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'playing':
      messageStart.classList.add('hidden');
      messageLose.classList.add('hidden');
      messageWin.classList.add('hidden');
      break;
  }
}
