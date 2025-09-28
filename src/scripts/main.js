'use strict';

const $cells = Array.from(document.querySelectorAll('.field-row .field-cell'));
const $score = document.querySelector('.game-score');
const $btn = document.querySelector('.button');
const $msgStart = document.querySelector('.message-start');
const $msgWin = document.querySelector('.message-win');
const $msgLose = document.querySelector('.message-lose');

const game = new Game();

function renderBoard(state) {
  let i = 0;

  for (const row of state) {
    for (const value of row) {
      const cell = $cells[i++];

      cell.textContent = value ? String(value) : '';

      Array.from(cell.classList)
        .filter((cls) => cls.startsWith('field-cell--'))
        .forEach((cls) => cell.classList.remove(cls));

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function renderScore(score) {
  $score.textContent = String(score);
}

function renderMessages(gameStatus) {
  $msgStart.classList.add('hidden');
  $msgWin.classList.toggle('hidden', gameStatus !== 'win');
  $msgLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function renderAll() {
  renderBoard(game.getState());
  renderScore(game.getScore());
  renderMessages(game.getStatus());

  const isIdle = game.getStatus() === 'idle';

  $btn.textContent = isIdle ? 'Start' : 'Restart';
  $btn.classList.toggle('start', isIdle);
  $btn.classList.toggle('restart', !isIdle);
}

function handleArrow(key) {
  switch (key) {
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
  renderAll();
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }
  handleArrow(e.key);
});

$btn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }
  renderAll();
});

renderAll();
