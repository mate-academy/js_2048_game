'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const Start = document.querySelector('.message-start');

const gameScore = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const fieldCells = document.querySelectorAll('.field-cell');

const Lose = document.querySelector('.message-lose');
const Win = document.querySelector('.message-win');

function render() {
  const flatBoard = game.getState().flat();
  const gameStatus = game.getStatus();

  fieldCells.forEach((cell, index) => {
    const value = flatBoard[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  gameScore.textContent = game.getScore();

  Lose.classList.toggle('hidden', gameStatus !== 'lose');
  Win.classList.toggle('hidden', gameStatus !== 'win');
  Start.classList.toggle('hidden', gameStatus !== 'idle');

  mainButton.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';
  mainButton.classList.toggle('start', gameStatus === 'idle');
  mainButton.classList.toggle('restart', gameStatus !== 'idle');
}

mainButton.addEventListener('click', () => {
  if (mainButton.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (evt) => {
  switch (evt.key) {
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

  render();
});

render();
