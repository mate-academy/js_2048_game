const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function render() {
  const state = game.getState().flat();

  state.forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = '';
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');

    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
  }

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
    default:
      return;
  }

  if (moved) {
    render();
  }
});

render();
