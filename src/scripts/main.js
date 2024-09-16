'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');

const rows = document.querySelectorAll('tr');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    button.innerHTML = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');

    messageStart.classList.add('hidden');

    game.start();
  } else {
    button.innerHTML = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');

    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');

    game.restart();
  }
  drawBoard();
});

document.addEventListener('keydown', (eventKey) => {
  let canMove = false;

  if (game.getStatus() === 'playing') {
    switch (eventKey.key) {
      case 'ArrowUp':
        canMove = game.moveUp();
        break;
      case 'ArrowDown':
        canMove = game.moveDown();
        break;
      case 'ArrowLeft':
        canMove = game.moveLeft();
        break;
      case 'ArrowRight':
        canMove = game.moveRight();
        break;
    }

    if (canMove) {
      setTimeout(() => {
        drawBoard();
        updateMessage();
      }, 300);
    }
  }
});

function drawBoard() {
  score.innerHTML = game.getScore();

  const board = game.getState();

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (board[y][x] === 0) {
        rows[y].cells[x].innerHTML = '';
      } else {
        rows[y].cells[x].innerHTML =
          `<div class="field-cell-num field-cell--${board[y][x]}">
            ${board[y][x]}
          </div>`;
      }
    }
  }
}

function updateMessage() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}
