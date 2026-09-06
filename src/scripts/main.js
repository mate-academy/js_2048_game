'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');

import Game from '../modules/Game.class';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  const lastSpawned = game.getLastSpawnedTile();

  scoreElement.textContent = score;

  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';
      cell.textContent = value !== 0 ? value : '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      if (
        lastSpawned &&
        lastSpawned.row === r &&
        lastSpawned.col === c &&
        value !== 0
      ) {
        cell.classList.add('field-cell--spawn');
      }

      cellIndex++;
    }
  }

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    mainButton.textContent = 'Start';
    mainButton.className = 'button start';
  } else {
    messageStart.classList.add('hidden');
    mainButton.textContent = 'Restart';
    mainButton.className = 'button restart';

    if (gameStatus === 'win') {
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
    } else if (gameStatus === 'lose') {
      messageLose.classList.remove('hidden');
      messageWin.classList.add('hidden');
    } else {
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
    }
  }
}

mainButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

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
  render();
});
render();
