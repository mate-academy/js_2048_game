import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });
}

function renderScore() {
  scoreEl.textContent = game.getScore();
}

function checkStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    msgStart.classList.add('hidden');
  } else {
    game.restart();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
    msgStart.classList.remove('hidden');
  }

  renderBoard();
  renderScore();
});

document.addEventListener('keydown', (e) => {
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

  renderBoard();
  renderScore();
  checkStatus();
});
