'use strict';

const Game = require('../modules/Game.class');
const fieldRow = [...document.querySelectorAll('.field-row')];
const scoreCeil = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const game = new Game(field);

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

  for (let i = 0; i < game.field.length; i++) {
    const fieldCell = [...fieldRow[i].querySelectorAll('.field-cell')];

    for (let j = 0; j < game.field[i].length; j++) {
      const cell = fieldCell[j];
      const cellValue = game.field[i][j];

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
    addField();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    addField();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    addField();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    addField();
  }
};

const handleStart = () => {
  document.addEventListener('keydown', handleKeyDown);

  if (game.getStatus() === 'playing') {
    game.restart();
    game.start();
    addField();
  }

  if (game.getStatus() === 'idle') {
    game.start();
    addField();
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  }
};

startBtn.addEventListener('click', handleStart);
