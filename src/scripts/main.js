'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const table = document.querySelector('.game-field');
const btnGame = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
let isLocked = true;

btnGame.addEventListener('click', function (e) {
  if (btnGame.classList.contains('start')) {
    if (game.getStatus() === 'idle') {
      isLocked = false;
      start();
      messageStart.classList.add('hidden');
    }
    btnGame.blur();
  }

  if (btnGame.classList.contains('restart')) {
    restartGame();
  }
});

document.addEventListener('keydown', function (e) {
  if (isLocked) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  drawState(game.getState());

  switch (game.getStatus()) {
    case 'playing':
      isLocked = false;
      btnGame.textContent = 'Restart';
      btnGame.classList.remove('start');
      btnGame.classList.add('restart');
      break;
    case 'win':
      messageWin.classList.remove('hidden');
      isLocked = true;
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      isLocked = true;
      break;
    case 'idle':
      isLocked = true;
      break;
  }
});

// Start the game
function start() {
  game.start();

  const state = game.getState();

  drawState(state);
}

function drawState(state) {
  score.textContent = game.getScore();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      const cell = getCell(i, j);

      cell.className = 'field-cell';
      cell.textContent = '';

      if (state[i][j] !== 0) {
        cell.classList.add('field-cell--' + state[i][j]);
        cell.textContent = state[i][j].toString();
      }
    }
  }
}

function getCell(numRow, numCol) {
  const rows = table.querySelectorAll('.field-row');

  return rows[numRow].querySelectorAll('.field-cell')[numCol];
}

function restartGame() {
  game.restart();
  drawState(game.getState());
  btnGame.textContent = 'Start';
  btnGame.classList.remove('restart');
  btnGame.classList.add('start');
  messageStart.classList.remove('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  btnGame.blur();
}
