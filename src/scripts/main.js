import Game from '../modules/Game.class.js';

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const value = state[r][c];

    cell.className = 'field-cell';
    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (game.getStatus() === 'win') {
    msgWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
    startBtn.textContent = 'Start';
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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

  render();
});

render();
