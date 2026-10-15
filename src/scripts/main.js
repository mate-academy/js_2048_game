'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');

const gameScore = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const mesWin = document.querySelector('.message-win');
const mesLose = document.querySelector('.message-lose');
const mesStart = document.querySelector('.message-start');

function render() {
  gameScore.textContent = game.getScore();

  const value = game.getState().flat();

  value.forEach((cellValue, index) => {
    const cell = cells[index];

    if (cellValue === 0) {
      cell.textContent = '';
      cell.className = 'field-cell';
    }

    if (cellValue > 0) {
      cell.textContent = cellValue;
      cell.className = `field-cell field-cell--${cellValue}`;
    }
  });

  mesWin.classList.add('hidden');
  mesLose.classList.add('hidden');
  mesStart.classList.add('hidden');

  if (game.getStatus() === 'idle') {
    mesStart.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    mesWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    mesLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'idle') {
    button.textContent = 'Start';
    button.className = 'button start';
  } else {
    button.textContent = 'Restart';
    button.className = 'button restart';
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;

    default:
      return;
  }

  render();
});

render();
