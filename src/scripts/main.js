'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');
const store = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

// eslint-disable-next-line no-shadow
const arrowsToggle = (event) => {
  if (event.key === 'ArrowUp') {
    game.moveUp();
    store.textContent = game.score;
  } else if (event.key === 'ArrowLeft') {
    game.moveLeft();
    store.textContent = game.score;
  } else if (event.key === 'ArrowRight') {
    game.moveRight();
    store.textContent = game.score;
  } else if (event.key === 'ArrowDown') {
    game.moveDown();
    store.textContent = game.score;
  }
};

startBtn.addEventListener('click', () => {
  startBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');

  game.start();

  document.addEventListener('keydown', arrowsToggle);
});

restartBtn.addEventListener('click', () => {
  restartBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');

  game.restart();

  game.score = 0;
  store.textContent = game.score;

  document.removeEventListener('keydown', arrowsToggle);
});

console.log(loseMessage, startMessage, winMessage);

switch (game.getStatus()) {
  case 'idle':
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    break;
  case 'playing':
    startMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    break;
  case 'win':
    winMessage.classList.remove('hidden');
    document.removeEventListener('keydown', arrowsToggle);
    break;
  case 'lose':
    console.log(123);
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keydown', arrowsToggle);
    break;
  default:
    break;
}
