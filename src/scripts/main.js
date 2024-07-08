'use strict';

const Game = require('../modules/Game.class');
const fieldRow = [...document.querySelectorAll('.field-row')];
const scoreCeil = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const game = new Game();

const addField = () => {
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyDown);
    game.gameStatus = 'playing';

    return;
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyDown);
    game.gameStatus = 'playing';

    return;
  }

  for (let i = 0; i < game.gameState.length; i++) {
    const fieldCell = [...fieldRow[i].querySelectorAll('.field-cell')];

    for (let j = 0; j < game.gameState[i].length; j++) {
      const cell = fieldCell[j];
      const cellValue = game.gameState[i][j];

      if (cellValue === 0 && cell.textContent > 0) {
        cell.classList.remove(`field-cell--${cell.textContent}`);
        cell.textContent = '';
      }

      if (cellValue > 0) {
        cell.classList.remove(`field-cell--${cell.textContent}`);
        cell.classList.add(`field-cell--${cellValue}`);
        cell.textContent = cellValue;
      }
    }
  }
  scoreCeil.textContent = game.gameScore;
};

const handleKeyDown = (e) => {
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

  addField();
};

const handleStart = () => {
  document.addEventListener('keydown', handleKeyDown);

  if (game.getStatus() === 'playing') {
    game.restart();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
    messageStart.classList.add('hidden');
  }

  addField();
};

startBtn.addEventListener('click', handleStart);
