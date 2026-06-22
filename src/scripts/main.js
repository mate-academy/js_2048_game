'use strict';
import '../styles/main.scss';
import Game from '../modules/Game.class';

const game = new Game();

const gameButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreDisplay = document.querySelector('.game-score');

const cells = [];
const rows = document.querySelectorAll('.field-row');

rows.forEach((row) => {
  cells.push(Array.from(row.querySelectorAll('.field-cell')));
});

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const stat = game.getStatus();

  if (scoreDisplay) {
    scoreDisplay.textContent = score;
  }

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cellElement = cells[r][c];
      const value = board[r][c];

      cellElement.textContent = value === 0 ? '' : value;
      cellElement.className = 'field-cell';

      if (value > 0) {
        cellElement.classList.add(`field-cell--${value}`);
      }
    }
  }

  if (messageWin) {
    messageWin.classList.add('hidden');
  }

  if (messageLose) {
    messageLose.classList.add('hidden');
  }

  if (stat === 'win' && messageWin) {
    messageWin.classList.remove('hidden');
  } else if (stat === 'lose' && messageLose) {
    messageLose.classList.remove('hidden');
  }
}

gameButton.addEventListener('click', () => {
  const isRestarting = gameButton.classList.toggle('restart');

  if (isRestarting) {
    game.start();
    gameButton.textContent = 'Restart';
    gameButton.style.fontSize = '18px';

    if (messageStart) {
      messageStart.classList.add('hidden');
    }
    updateUI();
  } else {
    game.initEmptyBoard();
    game.score = 0;
    game.status = 'idle';

    gameButton.textContent = 'Start';

    if (messageStart) {
      messageStart.classList.remove('hidden');
    }
    updateUI();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let keyHandled = false;

  switch (e.key) {
    case 'ArrowLeft': {
      game.moveLeft();
      keyHandled = true;
      break;
    }

    case 'ArrowRight': {
      game.moveRight();
      keyHandled = true;
      break;
    }

    case 'ArrowUp': {
      game.moveUp();
      keyHandled = true;
      break;
    }

    case 'ArrowDown': {
      game.moveDown();
      keyHandled = true;
      break;
    }

    default: {
      break;
    }
  }

  if (keyHandled) {
    e.preventDefault();
    updateUI();
  }
});
