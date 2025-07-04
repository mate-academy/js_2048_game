'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const tableCells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const startButton = document.querySelector('.button.start');

let lastNewTile = null;
let lastMerged = [];

function renderBoard(board) {
  board.flat().forEach((value, idx) => {
    const cell = tableCells[idx];
    const row = Math.floor(idx / game.size);
    const col = idx % game.size;

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);

      if (lastNewTile && lastNewTile.row === row && lastNewTile.col === col) {
        cell.classList.add('new');
      }

      if (lastMerged.some((t) => t.row === row && t.col === col)) {
        cell.classList.add('merged');
      }
    }
  });

  scoreElement.textContent = game.getScore();
  updateMessages();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

document.addEventListener('keydown', (e) => {
  if (
    [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'w',
      'a',
      's',
      'd',
    ].includes(e.key)
  ) {
    e.preventDefault();
  }

  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      handleMove(() => game.moveLeft());
      break;
    case 'ArrowRight':
    case 'd':
      handleMove(() => game.moveRight());
      break;
    case 'ArrowUp':
    case 'w':
      handleMove(() => game.moveUp());
      break;
    case 'ArrowDown':
    case 's':
      handleMove(() => game.moveDown());
      break;
    default:
      return;
  }

  renderBoard(game.getState());
});

startButton.addEventListener('click', () => {
  game.restart();
  renderBoard(game.getState());

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
});

function handleMove(moveFn) {
  const bef = game.getState().map((r) => [...r]);

  moveFn();

  const aft = game.getState();

  lastNewTile = findNewTile(bef, aft);
  lastMerged = game.lastMerged;

  renderBoard(aft);
}

function findNewTile(bef, aft) {
  for (let r = 0; r < aft.length; r++) {
    for (let c = 0; c < aft[r].length; c++) {
      if (bef[r][c] === 0 && aft[r][c] !== 0) {
        return { row: r, col: c };
      }
    }
  }

  return null;
}
