'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();
const btnStartText = 'Start';
const btnRestartText = 'Restart';

const gameField = document.querySelector('.game-field tbody');
const gameScore = document.querySelector('.game-score');
const controlBtn = document.querySelector('.controls .button');
const msgLose = document.querySelector('.message-lose');
const msgWin = document.querySelector('.message-win');
const msgStart = document.querySelector('.message-start');

controlBtn.addEventListener('click', (e) => {
  const btn = e.currentTarget;

  if (btn.classList.contains('start')) {
    btn.classList.remove('start');
    btn.classList.add('restart');
    btn.textContent = btnRestartText;
    game.start();
    renderBoard();
    renderMessage();

    return;
  }

  if (btn.classList.contains('restart')) {
    btn.classList.remove('restart');
    btn.classList.add('start');
    btn.textContent = btnStartText;
    game.restart();
    renderBoard();
    renderMessage();
  }
});

document.addEventListener('keydown', (e) => {
  let move = false;

  switch (e.key) {
    case 'ArrowUp':
      move = game.moveUp();
      break;
    case 'ArrowLeft':
      move = game.moveLeft();
      break;
    case 'ArrowDown':
      move = game.moveDown();
      break;
    case 'ArrowRight':
      move = game.moveRight();
      break;
    default:
  }

  if (move) {
    renderBoard();
  }

  if (game.status !== Game.STATUS_PLAYING) {
    renderMessage();
  }
});

function renderBoard() {
  for (let i = 0; i < gameField.rows.length; i++) {
    for (let j = 0; j < gameField.rows[i].cells.length; j++) {
      const cellValue = game.board[i][j] !== 0 ? game.board[i][j] : '';

      gameField.rows[i].cells[j].className = 'field-cell';
      gameField.rows[i].cells[j].classList.add(`field-cell--${cellValue}`);
      gameField.rows[i].cells[j].textContent = cellValue;
    }
  }

  gameScore.textContent = game.score;
}

function renderMessage() {
  msgLose.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgStart.classList.add('hidden');

  const gameStatus = game.status;

  if (gameStatus === Game.STATUS_IDLE) {
    msgStart.classList.remove('hidden');

    return;
  }

  if (gameStatus === Game.STATUS_WIN) {
    msgWin.classList.remove('hidden');

    return;
  }

  if (gameStatus === Game.STATUS_LOSE) {
    msgLose.classList.remove('hidden');
  }
}
