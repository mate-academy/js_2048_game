'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameButton = document.querySelector('.start');
const field = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function render() {
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  const grid = game.getState().flat();

  for (let i = 0; i < grid.length; i++) {
    field[i].textContent = grid[i] === 0 ? '' : grid[i];

    field[i].className = 'field-cell';

    if (field[i] !== 0) {
      field[i].classList.add('field-cell--' + grid[i]);
    }
  }

  score.textContent = game.getScore();

  switch (game.status) {
    case 'playing':
      gameButton.classList.remove('start');
      gameButton.classList.add('restart');
      gameButton.textContent = 'Restart';
      break;

    case 'win':
      winMessage.classList.remove('hidden');
      break;

    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
  }
}

gameButton.addEventListener('click', () => {
  game.restart();
  game.start();
  startMessage.classList.add('hidden');
  render();
});

window.addEventListener('keydown', (eventR) => {
  if (game.status !== 'playing') {
    return;
  }

  switch (eventR.key) {
    case 'ArrowUp':
      game.moveUp();
      eventR.preventDefault();
      render();
      break;

    case 'ArrowDown':
      game.moveDown();
      eventR.preventDefault();
      render();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      eventR.preventDefault();
      render();
      break;

    case 'ArrowRight':
      game.moveRight();
      eventR.preventDefault();
      render();
      break;
  }
});
