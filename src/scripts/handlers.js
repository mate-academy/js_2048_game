'use strict';

const {
  addRandomTwoOrFour,
  resetField,
  finishedGame,
} = require('./helpers');
const {
  mergeNumbers,
} = require('./move');
const {
  TURN_GRID,
} = require('./constants');

const fieldRow = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function startGame(event, grid, trRows, pLose, pWin, score) {
  const target = event.target.closest('.button');
  const pStart = document.querySelector('.message-start');

  if (target.classList.contains('start')) {
    target.classList.toggle('start', false);
    target.classList.add('restart');
    target.innerText = 'Restart';

    pStart.hidden = true;
  } else {
    resetField(grid, trRows);
    score.textContent = '0';

    if (pWin.classList.length < 3) {
      pWin.classList.add('hidden');
    }

    if (pLose.classList.length < 3) {
      pLose.classList.add('hidden');
    }
  }

  addRandomTwoOrFour(grid, trRows, pLose);
  addRandomTwoOrFour(grid, trRows, pLose);
};

function keyPressed(
  event,
  grid,
  trRows,
  pressButtonStart,
  score,
  pLose,
  pWin) {
  if (!pressButtonStart) {
    return;
  }

  switch (event.code) {
    case 'ArrowRight':
      mergeNumbers(grid, trRows, score, pLose, TURN_GRID.RIGHT);
      finishedGame(grid, pWin);
      break;
    case 'ArrowLeft':
      mergeNumbers(grid, trRows, score, pLose, TURN_GRID.LEFT);
      finishedGame(grid, pWin);
      break;
    case 'ArrowDown':
      mergeNumbers(grid, trRows, score, pLose, TURN_GRID.DOWN);
      finishedGame(grid, pWin);
      break;
    case 'ArrowUp':
      mergeNumbers(grid, trRows, score, pLose, TURN_GRID.UP);
      finishedGame(grid, pWin);
      break;
    default:
      break;
  }
}

module.exports = {
  messageWin,
  messageLose,
  fieldRow,
  gameScore,
  startGame,
  keyPressed,
};
