'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const startMsg = document.querySelector('.message-start');
const scoreEl = document.querySelector('.game-score');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');
const cellNodes = document.querySelectorAll('.field-cell');
const cells = [...cellNodes];

const updateCells = () => {
  cells.forEach((cell, index) => {
    const rowIndex = Math.floor(index / Game.COL_LENGTH);
    const colIndex = index % Game.COL_LENGTH;
    const cellValue = game.state[rowIndex][colIndex];

    cell.textContent = cellValue || '';
    cell.className = 'field-cell';

    if (cellValue) {
      cell.classList.add(`field-cell--${cellValue}`);
    }
  });

  scoreEl.textContent = game.getScore();
};

const handleArrowPress = (e) => {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      break;
  }

  updateCells();

  if (game.status === Game.GAME_STATUS.WIN) {
    winMsg.classList.remove('hidden');
  } else if (game.status === Game.GAME_STATUS.LOSE) {
    loseMsg.classList.remove('hidden');
  }
};

const handleStart = () => {
  if (game.status === Game.GAME_STATUS.IDLE) {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
    startBtn.classList.remove('start');
    startMsg.classList.add('hidden');
  } else {
    game.restart();
    startBtn.textContent = 'Start';
    loseMsg.classList.add('hidden');
    winMsg.classList.add('hidden');
    startBtn.classList.add('start');
    startBtn.classList.remove('restart');
    startMsg.classList.remove('hidden');
  }

  document.addEventListener('keydown', handleArrowPress);

  updateCells();

  if (game.status !== Game.GAME_STATUS.PLAYING) {
    document.removeEventListener('keydown', handleArrowPress);
  }
};

startBtn.addEventListener('click', handleStart);
