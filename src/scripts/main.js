import Game from '../modules/Game.class.js';

const game = new Game();

const table = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const startBtn = document.querySelector('.start');

function updateUI() {
  const cells = table.querySelectorAll('.field-cell');
  const grid = game.getState().flat();

  cells.forEach((cell, index) => {
    cell.className = 'field-cell';

    if (grid[index] !== 0) {
      cell.textContent = grid[index];
      cell.classList.add(`field-cell--${grid[index]}`);
    } else {
      cell.textContent = '';
    }
  });

  scoreEl.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

function startGame() {
  game.start();
  updateUI();
  messageStart.classList.add('hidden');
  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
}

function handleKey(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.move('left');
      break;
    case 'ArrowRight':
      game.move('right');
      break;
    case 'ArrowUp':
      game.move('up');
      break;
    case 'ArrowDown':
      game.move('down');
      break;
  }

  updateUI();
}

document.addEventListener('keydown', handleKey);
startBtn.addEventListener('click', startGame);
