'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const size = 4;
const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (game.getStatus() === 'idle') {
    startGame();
    button.className = 'button restart';
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    button.className = 'button start';
    button.textContent = 'Start';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    render();
  }
});

function startGame() {
  game.start();
  render();
}

document.addEventListener('keydown', keyListener);

function keyListener(e) {
  e.preventDefault();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  switch (e.key) {
    case 'ArrowDown':
      game.moveDown();
      render();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      render();
      break;

    case 'ArrowRight':
      game.moveRight();
      render();
      break;

    case 'ArrowUp':
      game.moveUp();
      render();
      break;

    default:
      break;
  }
}

function render() {
  const state = game.getState();

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const element = fieldRows[row].children[col];
      const cell = state[row][col];

      if (cell === 0) {
        element.textContent = '';
        element.className = 'field-cell';
      } else {
        element.textContent = cell;
        element.className = `field-cell field-cell--${cell}`;
        element.style.top = '0px';
        element.style.left = '0px';
      }

      setTimeout(() => {
        element.style.top = '100px';
        element.style.left = '100px';
      }, 400);
    }
  }

  gameScore.textContent = game.getScore();
}
