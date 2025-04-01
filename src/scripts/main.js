'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const fieldCell = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message.message-start');
const messageLose = document.querySelector('.message.message-lose');
const messageWin = document.querySelector('.message.message-win');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.board = game.start();
    updateSiteBoard();

    button.classList.remove('start');
    button.textContent = 'Restart';
    button.classList.add('restart');

    messageStart.classList.add('hidden');
  } else if (button.classList.contains('restart')) {
    for (let i = 0; i < 16; i++) {
      const fieldValue = game.board[i];
      const currentCell = fieldCell[i];

      if (fieldValue !== 0) {
        currentCell.textContent = '';
        currentCell.classList.remove(`field-cell--${fieldValue}`);
      }
    }

    game.board = game.start();
    updateSiteBoard();
    game.status = 'playing';
    game.score = 0;
    updateScore(0);
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
});

document.addEventListener('keydown', (arrow) => {
  const copiedBoard = [...game.board];

  switch (arrow.key) {
    case 'ArrowUp':
      game.moveUp();

      if (game.checkIfMoved(copiedBoard)) {
        if (game.checkIfWon()) {
          messageWin.classList.remove('hidden');
        }

        game.getNewCell();
        updateSiteBoard();
        updateScore(game.getScore());
      } else if (game.checkIfLose()) {
        game.status = 'lose';
        messageLose.classList.remove('hidden');
      }
      break;
    case 'ArrowDown':
      game.moveDown();

      if (game.checkIfMoved(copiedBoard)) {
        if (game.checkIfWon()) {
          messageWin.classList.remove('hidden');
        }

        game.getNewCell();
        updateSiteBoard();
        updateScore(game.getScore());
      } else if (game.checkIfLose()) {
        game.status = 'lose';
        messageLose.classList.remove('hidden');
      }
      break;
    case 'ArrowLeft':
      game.moveLeft();

      if (game.checkIfMoved(copiedBoard)) {
        if (game.checkIfWon()) {
          messageWin.classList.remove('hidden');
        }

        game.getNewCell();
        updateSiteBoard();
        updateScore(game.getScore());
      } else if (game.checkIfLose()) {
        game.status = 'lose';
        messageLose.classList.remove('hidden');
      }
      break;
    case 'ArrowRight':
      game.moveRight();

      if (game.checkIfMoved(copiedBoard)) {
        if (game.checkIfWon()) {
          messageWin.classList.remove('hidden');
        }

        game.getNewCell();
        updateSiteBoard();
        updateScore(game.getScore());
      } else if (game.checkIfLose()) {
        game.status = 'lose';
        messageLose.classList.remove('hidden');
      }
      break;
  }
});

function updateSiteBoard() {
  for (let i = 0; i < 16; i++) {
    const fieldValue = game.board[i];
    const currentCell = fieldCell[i];

    fieldCell[i].className = '';
    currentCell.classList.add(`field-cell`);

    if (fieldValue !== 0) {
      currentCell.textContent = fieldValue;
      currentCell.classList.add(`field-cell--${fieldValue}`);
    } else {
      currentCell.textContent = '';
    }
  }
}

function updateScore(score) {
  const gameScore = document.querySelector('.game-score');

  gameScore.textContent = score;
}
