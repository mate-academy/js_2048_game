'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const rows = Array.from(document.querySelectorAll('.field-row'));

const buttonStart = document.querySelector('button');

const score = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

buttonStart.addEventListener('click', (e) => {
  e.target.textContent = 'Restart';
  game.status = game.state.playing;
  buttonStart.className = 'button restart';

  if (game.status === 'idle') {
    game.status = game.state.playing;
    updateBoard(game.board);
    updateMessages();

    return;
  }

  if (game.status === 'playing' || game.status === 'lose') {
    updateMessages();
    game.restart();
    game.startNumbers();
    game.status = game.state.playing;
    updateBoard(game.board);
  }
});

function updateMessages() {
  const stat = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (game.hasOtherMoves(game.board) === false) {
    game.status = game.state.lose;
    buttonStart.className = 'button restart';
    buttonStart.textContent = 'Restart';
  }

  switch (stat) {
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    case 'playing':
      break;
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    default:
      return;
  }
}

function updateBoard(board) {
  for (let row = 0; row < game.size; row++) {
    for (let col = 0; col < game.size; col++) {
      Array.from(rows[row].children)[col].textContent = board[row][col];

      if (board[row][col] !== 0) {
        Array.from(rows[row].children)[col].className =
          `field-cell field-cell--${board[row][col]}`;
      }

      if (board[row][col] === 0) {
        Array.from(rows[row].children)[col].textContent = '';
        Array.from(rows[row].children)[col].className = 'field-cell';
      }

      if (board[row][col] === game.gameGoal) {
        game.status = game.state.win;
      }
    }
  }
  score.textContent = game.score;
  game.status = game.getStatus();
  updateMessages();
  game.hasOtherMoves(game.board);
}

function isBoardChanged(beforeArr, afterArr) {
  for (let i = 0; i < game.size; i++) {
    for (let j = 0; j < game.size; j++) {
      if (beforeArr[i][j] !== afterArr[i][j]) {
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

  updateBoard(game.board);
});
