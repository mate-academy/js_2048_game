/* eslint-disable no-console */
/* eslint-disable no-shadow */
'use strict';
import { Game } from '../modules/Game.class.js';

let game;

const boardEl = document.querySelector('.game-field tbody');
const scoreEl = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

startButton.addEventListener('click', restartGame);
document.addEventListener('keydown', handleMove);

function renderBoard() {
  boardEl.innerHTML = '';

  for (let r = 0; r < 4; r++) {
    const row = document.createElement('tr');

    row.classList.add('field-row');

    for (let c = 0; c < 4; c++) {
      const cell = document.createElement('td');

      cell.classList.add('field-cell');

      if (game.board[r][c]) {
        cell.classList.add(`field-cell--${game.board[r][c]}`);
        cell.textContent = game.board[r][c];
      }

      row.appendChild(cell);
    }

    boardEl.appendChild(row);
  }

  scoreEl.textContent = game.score;
}

function handleMove(event) {
  if (!game || game.status !== 'playing') {
    return;
  }

  event.preventDefault();

  let moved = false;

  switch (event.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      moved = false;
  }

  console.log('Moved:', moved);

  if (moved) {
    renderBoard();

    if (game.checkWin()) {
      messageWin.classList.remove('hidden');
      game.status = 'won';
    }

    if (game.checkGameOver()) {
      messageLose.classList.remove('hidden');
      game.status = 'lost';
    }
  }
}

function restartGame() {
  game = new Game();
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
  startButton.classList.remove('start');

  renderBoard();
}
