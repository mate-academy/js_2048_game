'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

const startBtn = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message.message-start');
const messageLose = document.querySelector('.message.message-lose');
const messageWinner = document.querySelector('.message.message-win');

function render() {
  const state = game.getState();

  scoreEl.textContent = game.getScore();

  // flatten 2D state into the 16 <td> cells
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value > 0) {
      cell.className = `field-cell field-cell--${value}`;

      if (game.mergedPositions?.some((p) => p.row === row && p.col === col)) {
        cell.classList.add('merge');
        setTimeout(() => cell.classList.remove('merge'), 300);
      }

      if (
        game.lastSpawned &&
        game.lastSpawned.row === row &&
        game.lastSpawned.col === col
      ) {
        cell.classList.add('spawn');
        setTimeout(() => cell.classList.remove('spawn'), 300);
      }
    }
  });
  game.mergedPositions = [];
  game.lastSpawned = null;
}

startBtn.addEventListener('click', () => {
  game.start();
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWinner.classList.add('hidden');
  startBtn.textContent = 'Reset';
  startBtn.className = 'button restart';
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const beforeMove = JSON.stringify(game.getState());

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  const afterMove = JSON.stringify(game.getState());

  if (beforeMove !== afterMove) {
    render();

    if (!game.isMovePossible()) {
      game.status = 'lose';
      messageLose.classList.remove('hidden');
    }
  }

  if (game.score === 2048) {
    game.status = 'win';
    messageWinner.classList.remove('hidden');
  }
});
