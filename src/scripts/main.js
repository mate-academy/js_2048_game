'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('button');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameFieldRows = document.querySelectorAll('.field-row');
const gameFieldArray = [...gameFieldRows].map((row) => {
  return [...row.querySelectorAll('.field-cell')];
});

function handleKeyDown(e) {
  if (game.getStatus() === 'playing') {
    if (e.key === 'ArrowLeft') {
      game.moveLeft();
      updateUi();
    }

    if (e.key === 'ArrowRight') {
      game.moveRight();
      updateUi();
    }

    if (e.key === 'ArrowUp') {
      game.moveUp();
      updateUi();
    }

    if (e.key === 'ArrowDown') {
      game.moveDown();
      updateUi();
    }
  }
}

function updateUi() {
  updateGameField();
  toggleGameMessege();
}

function updateGameField() {
  const state = game.getState();

  gameFieldArray.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      const value = state[rowIdx][colIdx];

      cell.textContent = value !== 0 ? value : '';
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  score.textContent = `${game.getScore()}`;
}

function toggleGameButton() {
  if (button.classList.contains('start')) {
    startGame();
  } else if (button.classList.contains('restart')) {
    restartGame();
  }
}

function toggleGameMessege() {
  const stat = game.getStatus();

  [messageStart, messageLose, messageWin].forEach((message) => {
    return message.classList.add('hidden');
  });

  if (stat === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (stat === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (stat === 'win') {
    messageWin.classList.remove('hidden');
  }
}

function startGame(e) {
  game.start();

  button.classList.remove('start');
  button.classList.add('restart');
  messageStart.classList.add('hidden');
  button.textContent = 'Restart';

  updateUi();
}

function restartGame(e) {
  game.restart();

  button.classList.remove('restart');
  button.classList.add('start');
  messageStart.classList.remove('hidden');
  button.textContent = 'Start';

  updateUi();
}

document.addEventListener('keydown', handleKeyDown);
button.addEventListener('click', toggleGameButton);
