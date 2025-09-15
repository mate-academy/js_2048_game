'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const buttonStart = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function handleScoreUpdate() {
  gameScore.textContent = game.getScore();
}

function updateCell(cell, value) {
  [...cell.classList].forEach((cls) => {
    if (cls.startsWith('field-cell--')) {
      cell.classList.remove(cls);
    }
  });

  if (value !== 0) {
    cell.classList.add(`field-cell--${value}`);
    cell.textContent = value;
  } else {
    cell.textContent = '';
  }
}

function handleCellUpdate() {
  const gameField = game.getState();
  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((row, rowIndex) => {
    Array.from(row.cells).forEach((cell, colIndex) => {
      updateCell(cell, gameField[rowIndex][colIndex]);
    });
  });

  handleScoreUpdate();
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === Game.gameStatus.playing) {
    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        moved = true;
        break;
      case 'ArrowDown':
        game.moveDown();
        moved = true;
        break;
      case 'ArrowLeft':
        game.moveLeft();
        moved = true;
        break;
      case 'ArrowRight':
        game.moveRight();
        moved = true;
        break;
    }

    if (moved) {
      handleCellUpdate();
      game.checkLose();
      game.checkWin();
      updateMessageText();
    }
  }
});

function updateMessageText() {
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (game.getStatus() === Game.gameStatus.win) {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === Game.gameStatus.lose) {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === Game.gameStatus.idle) {
    messageStart.classList.remove('hidden');
  }
}

buttonStart.addEventListener('click', (e) => {
  e.preventDefault();

  if (game.getStatus() === Game.gameStatus.idle) {
    game.start();
    game.status = Game.gameStatus.playing;
    messageStart.classList.add('hidden');
    buttonStart.classList.replace('start', 'restart');
    buttonStart.textContent = 'Restart';
  } else {
    buttonStart.classList.replace('restart', 'start');
    buttonStart.textContent = 'Start';
    game.restart();
  }
  updateMessageText();
  handleCellUpdate();
});
