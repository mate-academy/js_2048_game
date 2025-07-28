import { Game } from '../modules/Game.class.js';

const game = new Game();
const boardEl = document.querySelector('.game-field');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start');

function render() {
  const state = game.getState();
  const rows = boardEl.querySelectorAll('tr');

  rows.forEach((rowEl, rowIndex) => {
    const cells = rowEl.querySelectorAll('td');

    cells.forEach((cellEl, colIndex) => {
      const value = state[rowIndex][colIndex];

      cellEl.className = 'field-cell'; // reset klas

      if (value) {
        cellEl.classList.add(`field-cell--${value}`);
        cellEl.textContent = value;
      } else {
        cellEl.textContent = '';
      }
    });
  });

  scoreEl.textContent = game.getScore();

  statusEl.textContent =
    game.getStatus() === 'won'
      ? 'You win!'
      : game.getStatus() === 'gameover'
        ? 'Game over!'
        : '';
}

startBtn.addEventListener('click', () => {
  if (
    game.getStatus() === 'start' ||
    game.getStatus() === 'gameover' ||
    game.getStatus() === 'won'
  ) {
    game.restart();
    render();
    startBtn.textContent = 'Start'; // resetujemy przycisk na Start po restarcie
  }
  game.start();
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    if (startBtn.textContent !== 'Restart') {
      startBtn.textContent = 'Restart';
    }

    render();

    const gameStatus = game.getStatus();

    if (gameStatus === 'won') {
      alert('You win!');
    } else if (gameStatus === 'gameover') {
      alert('Game over!');
    }
  }
});

render();
