'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const fieldCell = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  for (let r = 0; r < state.length; r++) {
    for (let c = 0; c < state[r].length; c++) {
      const index = r * 4 + c;
      const cell = fieldCell[index];

      cell.className = 'field-cell';

      if (state[r][c] === 0) {
        cell.textContent = '';
      }

      if (state[r][c] > 0) {
        const value = state[r][c];

        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  gameScore.textContent = score;

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
  }

  if (gameStatus === 'playing') {
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }
}

startBtn.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing') {
    game.restart();
  } else {
    game.start();
  }

  render();
});

document.addEventListener('keydown', (keyEvent) => {
  const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (gameKeys.includes(keyEvent.key)) {
    keyEvent.preventDefault();
  }

  if (keyEvent.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (keyEvent.key === 'ArrowRight') {
    game.moveRight();
  }

  if (keyEvent.key === 'ArrowUp') {
    game.moveUp();
  }

  if (keyEvent.key === 'ArrowDown') {
    game.moveDown();
  }

  render();
});
