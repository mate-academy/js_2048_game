'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
let firstMove = false;

const tableRows = document.querySelectorAll('.field-row');
const scorefield = document.getElementById('game-res');
const startbtn = document.getElementById('start');

// eslint-disable-next-line no-shadow
function updateMessage(status) {
  const loseMsg = document.querySelector('.message-lose');
  const winMsg = document.querySelector('.message-win');
  const startMsg = document.querySelector('.message-start');

  loseMsg.classList.add('hidden');
  winMsg.classList.add('hidden');
  startMsg.classList.add('hidden');

  if (status === 'idle') {
    startMsg.classList.remove('hidden');
  } else if (status === 'win') {
    winMsg.classList.remove('hidden');
  } else if (status === 'lose') {
    loseMsg.classList.remove('hidden');
  }
}

function renderBoard(board) {
  scorefield.textContent = game.getScore();

  for (let r = 0; r < board.length; r++) {
    const cells = tableRows[r].querySelectorAll('.field-cell');

    for (let c = 0; c < board[r].length; c++) {
      const value = board[r][c];
      const cell = cells[c];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  updateMessage(game.getStatus());
}

startbtn.addEventListener('click', () => {
  if (!firstMove) {
    game.start();
    firstMove = true;
    startbtn.classList.replace('start', 'restart');
    startbtn.textContent = 'Restart';
  } else {
    game.restart();
    firstMove = false;
    startbtn.classList.replace('restart', 'start');
    startbtn.textContent = 'Start';
  }
  renderBoard(game.board);
});

renderBoard(game.board);

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (!firstMove) {
    return;
  }

  switch (event.key) {
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

  renderBoard(game.board);
});
