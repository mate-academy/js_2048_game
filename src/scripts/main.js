import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const buttonEl = document.querySelector('.button');
const startMsgEl = document.querySelector('.message-start');
const winMsgEl = document.querySelector('.message-win');
const loseMsgEl = document.querySelector('.message-lose');

const cells = Array.from(document.querySelectorAll('.game-field .field-cell'));

const clearCellClasses = (cell) => {
  cell.className = 'field-cell';
};

const renderBoard = () => {
  const state = game.getState();

  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const idx = r * 4 + c;
      const cell = cells[idx];
      const value = state[r][c];

      clearCellClasses(cell);
      cell.textContent = value === 0 ? '' : String(value);

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
};

const renderScore = () => {
  scoreEl.textContent = String(game.getScore());
};

const renderMessages = () => {
  const gameStatus = game.getStatus();

  startMsgEl.classList.toggle('hidden', gameStatus !== 'idle');
  winMsgEl.classList.toggle('hidden', gameStatus !== 'win');
  loseMsgEl.classList.toggle('hidden', gameStatus !== 'lose');
};

const renderButton = () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    buttonEl.textContent = 'Start';
    buttonEl.classList.add('start');
    buttonEl.classList.remove('restart');
  } else {
    buttonEl.textContent = 'Restart';
    buttonEl.classList.add('restart');
    buttonEl.classList.remove('start');
  }
};

const renderAll = () => {
  renderBoard();
  renderScore();
  renderMessages();
  renderButton();
};

const handleMove = (dir) => {
  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  let moved = false;

  if (dir === 'left') {
    moved = game.moveLeft();
  }

  if (dir === 'right') {
    moved = game.moveRight();
  }

  if (dir === 'up') {
    moved = game.moveUp();
  }

  if (dir === 'down') {
    moved = game.moveDown();
  }

  if (moved) {
    renderAll();
  }
};

buttonEl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  renderAll();
});

document.addEventListener('keydown', (e) => {
  const map = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  const dir = map[e.key];

  if (!dir) {
    return;
  }

  e.preventDefault();
  handleMove(dir);
});

renderAll();
