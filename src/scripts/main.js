'use strict';

import Game from '../modules/Game.class';

const button = document.querySelector('.button');
const game = new Game();

function hideAllMessages() {
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
}

function showWinMessage() {
  hideAllMessages();
  document.querySelector('.message-win').classList.remove('hidden');
}

function showLoseMessage() {
  hideAllMessages();
  document.querySelector('.message-lose').classList.remove('hidden');
}

function hideStartMessage() {
  document.querySelector('.message-start').classList.add('hidden');
}

if (button) {
  button.addEventListener('click', () => {
    const statusGame = game.getStatus();

    if (statusGame === 'idle') {
      game.start();
      hideStartMessage();
      updateDom();
      button.classList.add('restart');
      button.classList.remove('start');
      button.textContent = 'Restart';
    } else if (
      statusGame === 'playing' ||
      statusGame === 'win' ||
      statusGame === 'lose'
    ) {
      game.restart();
      hideAllMessages();
      document.querySelector('.message-start').classList.remove('hidden');
      updateDom();
      button.classList.remove('restart');
      button.classList.add('start');
      button.textContent = 'Start';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
    return;
  }

  let moved = false;

  if (e.code === 'ArrowLeft') {
    moved = game.moveLeft();
  } else if (e.code === 'ArrowRight') {
    moved = game.moveRight();
  } else if (e.code === 'ArrowDown') {
    moved = game.moveDown();
  } else if (e.code === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (moved) {
    game.addRandomTile();
  }

  updateDom();
});

function updateDom() {
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');
  const score = document.querySelector('.game-score');

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cellValue = board[row][col];
      const cell = cells[row * 4 + col];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (cellValue !== 0) {
        cell.classList.add(`field-cell--${cellValue}`);
        cell.textContent = cellValue;
      }
    }
  }

  score.textContent = game.getScore();

  if (game.getStatus() === 'playing' && !game._canMove()) {
    game.statusGame = 'lose';
  }

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    showWinMessage();
  } else if (gameStatus === 'lose') {
    showLoseMessage();
  }
}
