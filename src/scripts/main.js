import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');

const msgLose = document.querySelector('.message-lose');
const msgWin = document.querySelector('.message-win');
const msgStart = document.querySelector('.message-start');

function updateUI() {
  scoreElement.textContent = game.getScore();

  const board = game.getState();

  cells.forEach((cell, index) => {
    const r = Math.floor(index / 4);
    const c = index % 4;
    const val = board[r][c];

    const prevText = cell.textContent;
    const wasEmpty = !prevText || prevText === '';
    const prevVal = wasEmpty ? 0 : parseInt(prevText, 10);

    cell.className = 'field-cell';

    if (val > 0) {
      cell.textContent = val;
      cell.classList.add(`field-cell--${val}`);

      if (wasEmpty) {
        cell.classList.add('field-cell--new');
      } else if (prevVal !== val) {
        cell.classList.add('field-cell--pop');
      }
    } else {
      cell.textContent = '';
    }
  });

  const currentStatus = game.getStatus();

  if (currentStatus === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  } else {
    msgStart.classList.add('hidden');

    if (currentStatus === 'win') {
      msgWin.classList.remove('hidden');
      msgLose.classList.add('hidden');
    } else if (currentStatus === 'lose') {
      msgWin.classList.add('hidden');
      msgLose.classList.remove('hidden');
    } else {
      msgWin.classList.add('hidden');
      msgLose.classList.add('hidden');
    }
  }

  if (currentStatus !== 'idle') {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    updateUI();
  } else if (button.classList.contains('restart')) {
    game.restart();
    updateUI();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
  } else {
    return;
  }

  const boardBefore = JSON.stringify(game.getState());

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
  }

  const boardAfter = JSON.stringify(game.getState());

  if (boardBefore !== boardAfter) {
    updateUI();
  }
});

// Initial render
updateUI();
