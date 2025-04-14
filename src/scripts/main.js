'use strict';

const RESTART_BUTTON_TEXT = 'Restart';
const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');

startButton.addEventListener('click', (e) => {
  if (e.target.textContent === RESTART_BUTTON_TEXT) {
    game.restart();
  } else {
    game.start();
    startButton.textContent = RESTART_BUTTON_TEXT;
    startMessage.classList.add('hidden');
  }

  loseBanner();
  wonBanner();
  drowState();
  drawScore();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === Game.STATUS_IDLE) {
    game.setStatus(Game.STATUS_PLAYING);
  }

  if (game.getStatus() !== Game.STATUS_PLAYING) {
    return;
  }

  e.preventDefault();

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    default:
      break;
  }

  if (game.getStatus() === Game.STATUS_LOSE) {
    loseBanner(true);
    wonBanner();
  }

  if (game.getStatus() === Game.STATUS_WIN) {
    wonBanner(true);
    loseBanner();
  }

  drowState();
  drawScore();
  checkMoves();
});

function drowState() {
  const state = game.getState();
  const table = document.querySelector('.game-field');

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = table.rows[i].cells[j];
      const classes = cell.className.split(/\s/);
      const newClasses = classes.filter(
        (cls) => !cls.startsWith('field-cell--'),
      );

      cell.className = newClasses.join(' ');

      if (state[i][j] === 0) {
        cell.textContent = '';
      } else {
        cell.classList.add(`field-cell--${state[i][j]}`);
        cell.textContent = state[i][j];
      }
    }
  }
}

function drawScore() {
  const scoreBoard = document.querySelector('.game-score');

  scoreBoard.textContent = game.getScore().toString();
}

function checkMoves() {
  if (!game.hasOtherMoves()) {
    game.gameOver();
    loseBanner(true);
    wonBanner();
  }
}

function loseBanner(show = false) {
  const banner = document.querySelector('.message-lose');

  if (show) {
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

function wonBanner(show = false) {
  const banner = document.querySelector('.message-win');

  if (show) {
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}
