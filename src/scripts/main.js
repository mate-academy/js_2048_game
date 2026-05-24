import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  fieldRows.forEach((row, rowIdx) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, colIdx) => {
      const value = state[rowIdx][colIdx];

      cell.className = 'field-cell';
      cell.textContent = value || '';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

function updateScore() {
  scoreEl.textContent = game.getScore();
}

function checkStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    game.start();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  renderBoard();
  updateScore();
});

document.addEventListener('keydown', (e) => {
  const keyMap = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };
  const action = keyMap[e.key];

  if (!action || game.getStatus() !== 'playing') {
    return;
  }

  action();
  renderBoard();
  updateScore();
  checkStatus();
});
