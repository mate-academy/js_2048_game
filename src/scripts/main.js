'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');

const startGame = document.querySelector('.button.start');

startGame.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  startGame.textContent = 'Restart';
  startGame.classList.remove('start');
  startGame.classList.add('restart');

  if (game.getStatus() === 'playing') {
    document.querySelector('.message.message-start').classList.add('hidden');
    document.querySelector('.message.message-lose').classList.add('hidden');
  }

  updateUi();
});

function updateUi() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  score.textContent = game.getScore();

  cells.forEach((cell) => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state[row][col];

      if (value !== 0) {
        const index = row * 4 + col;

        cells[index].textContent = value;
        cells[index].classList.add(`field-cell--${value}`);
      }
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
    default:
      return;
  }
  updateUi();

  if (game.getStatus() === 'lose') {
    document
      .querySelector('.message.message-lose.hidden')
      .classList.remove('hidden');
    document.querySelector('.message.message-start').classList.add('hidden');
    document.querySelector('.message.message-win').classList.add('hidden');

    startGame.textContent = 'Start';
    startGame.classList.remove('restart');
    startGame.classList.add('start');
  }

  if (game.getStatus() === 'win') {
    document
      .querySelector('.message.message-win hidden')
      .classList.remove('hidden');
    document.querySelector('.message.message-start').classList.add('hidden');

    document
      .querySelector('.message.message-lose.hidden')
      .classList.add('hidden');
  }
});
