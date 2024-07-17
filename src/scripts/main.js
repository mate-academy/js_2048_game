'use strict';

const Game = require('../modules/Game.class');
const boardEl = document.querySelector('.game-field > tbody');
const startBt = document.querySelector('.start');
const scoreCur = document.querySelector('.curScore');
const scoreMax = document.querySelector('.maxScore');
const msgStartEl = document.querySelector('.message-start');
const msgWinEl = document.querySelector('.message-win');
const msgLoseEl = document.querySelector('.message-lose');
const game = new Game();
function update() {
  const curBoard = game.getBoard();
  for (let row = 0; row < curBoard.length; row++) {
    for (let i = 0; i < curBoard[row].length; i++) {
      const cel = boardEl.rows[row].cells[i];
      const val = curBoard[row][i];

      if (val) {
        cel.textContent = val;
        cel.classList = 'field-cell';
        cel.classList.add(`field-cell--${val}`);
      } else {
        cel.textContent = '';
        cel.classList = 'field-cell';
      }
    }
  }

  scoreMax.textContent = game.getScoreMax();
  scoreCur.textContent = game.getScore();

  if (game.getStatus() === 'idle') {
    startBt.classList = 'button start';
    startBt.textContent = 'Start';
  } else {
    startBt.classList = 'button restart';
    startBt.textContent = 'Restart';
  }

  switch (game.getStatus()) {
    case 'playing':
      [msgStartEl, msgWinEl, msgLoseEl].forEach((msg) =>
        !msg?.classList.contains('hidden') ? msg?.classList.add('hidden') : '',
      );
      break;

    case 'idle':
      msgStartEl?.classList.remove('hidden');
      break;

    case 'win':
      msgWinEl?.classList.remove('hidden');
      break;

    case 'lose':
      msgLoseEl?.classList.remove('hidden');
      break;
  }
}

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() === 'playing') {
    switch (ev.key) {
      case 'ArrowRight':
        game.moveRight();
        break;

      case 'ArrowLeft':
        game.moveLeft();
        break;

      case 'ArrowUp':
        game.moveUp();
        break;

      case 'ArrowDown':
        game.moveDown();
        break;
    }
    update();
  }
});

startBt?.addEventListener('click', (ev) => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  update();
});
