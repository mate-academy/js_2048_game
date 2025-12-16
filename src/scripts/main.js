/* eslint-disable padding-line-between-statements */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// eslint-disable-next-line no-console

const rows = Array.from(document.querySelectorAll('.field-row'));

const buttonStart = document.querySelector('button');

const score = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

window.addEventListener('load', () => {
  game.startNumbers();
  actualise(game.board);
});

buttonStart.addEventListener('click', (e) => {
  e.target.textContent = 'Restart';
  game.status = 'playing';
  buttonStart.className = 'button restart';

  if (game.status === 'idle') {
    game.startNumbers();
    game.status = 'playing';
    actualise(game.board);
    updateMessages();
    return;
  }

  if (game.status === 'playing' || game.status === 'lose') {
    updateMessages();
    game.restart();
    game.startNumbers();
    game.status = 'playing';
    actualise(game.board);
  }
});

function updateMessages() {
  const stat = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (game.hasOtherMoves(game.board) === false) {
    game.status = 'lose';
    buttonStart.className = 'button restart';
    buttonStart.textContent = 'Restart';
  }

  if (stat === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (stat === 'playing') {
  } else if (stat === 'win') {
    messageWin.classList.remove('hidden');
  } else if (stat === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function actualise(board) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      Array.from(rows[row].children)[col].textContent = board[row][col];
      if (board[row][col] !== 0) {
        Array.from(rows[row].children)[col].className =
          `field-cell field-cell--${board[row][col]}`;
      }
      if (board[row][col] === 0) {
        Array.from(rows[row].children)[col].textContent = '';
        Array.from(rows[row].children)[col].className = 'field-cell';
      }
      if (board[row][col] === 2048) {
        game.status = 'win';
      }
    }
  }
  score.textContent = game.score;
  game.status = game.getStatus();
  updateMessages();
  game.hasOtherMoves(game.board);
}

function isBoardChanged(before, after) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (before[i][j] !== after[i][j]) {
        return true;
      }
    }
  }
  return false;
}

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  const boardBefore = game.getState();

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft(game.board);
      break;
    case 'ArrowRight':
      game.moveRight(game.board);
      break;
    case 'ArrowUp':
      game.moveUp(game.board);
      break;
    case 'ArrowDown':
      game.moveDown(game.board);
      break;
    default:
      return;
  }

  if (isBoardChanged(boardBefore, game.board)) {
    game.addNumbers(game.board);
  }

  console.log(game.status);
  actualise(game.board);
});

// window.setInterval(() => {
//   console.log(game.status);
// }, '2000');
