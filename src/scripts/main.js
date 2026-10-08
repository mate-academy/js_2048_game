'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button.start');
const allCells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message.message-lose');
const messageWin = document.querySelector('.message.message-win');
const messageStart = document.querySelector('.message.message-start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    game.restart();
    startButton.textContent = 'Start';
    startButton.className = 'button start';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  } else {
    game.start();
    messageStart.classList.add('hidden');
  }

  renderPage();
});

const renderPage = function () {
  gameScore.textContent = game.getScore();

  const matrix = game.getState();

  matrix.flat().forEach((num, index) => {
    allCells[index].textContent = '';
    allCells[index].className = `field-cell`;

    if (num !== 0) {
      allCells[index].className = `field-cell field-cell--${num}`;
      allCells[index].textContent = num;
    }
  });

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
};

document.body.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  const eventNames = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (
    eventNames.includes(keyboardEvent.key) &&
    !startButton.classList.contains('restart')
  ) {
    startButton.textContent = 'Restart';
    startButton.className = 'button restart';
  }

  switch (keyboardEvent.key) {
    case 'ArrowUp':
      game.moveUp();
      renderPage();
      break;

    case 'ArrowDown':
      game.moveDown();
      renderPage();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      renderPage();
      break;

    case 'ArrowRight':
      game.moveRight();
      renderPage();
      break;

    default:
      break;
  }
});
