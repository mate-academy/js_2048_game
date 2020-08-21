'use strict';

const {
  addRandomTwoOrFour,
  resetField,
  finishedGame,
  addStyleToField,
  renderField,
} = require('./helpers');
const {
  mergeNumbers,
  rotateMatrix,
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

  addRandomTwoOrFour(grid, pLose);
  addRandomTwoOrFour(grid, pLose);
  renderField(grid, trRows);
  addStyleToField(trRows);
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

  if ((event.code !== 'ArrowRight')
  && (event.code !== 'ArrowLeft')
  && (event.code !== 'ArrowDown')
  && (event.code !== 'ArrowUp')) {
    return;
  }

  switch (event.code) {
    case 'ArrowRight':
      rotateMatrix(grid, TURN_GRID.RIGHT.FIRST);
      mergeNumbers(grid, score);
      rotateMatrix(grid, TURN_GRID.RIGHT.SECOND);
      break;
    case 'ArrowLeft':
      rotateMatrix(grid, TURN_GRID.LEFT.FIRST);
      mergeNumbers(grid, score);
      rotateMatrix(grid, TURN_GRID.LEFT.SECOND);
      break;
    case 'ArrowDown':
      rotateMatrix(grid, TURN_GRID.DOWN.FIRST);
      mergeNumbers(grid, score);
      rotateMatrix(grid, TURN_GRID.DOWN.SECOND);
      break;
    case 'ArrowUp':
      rotateMatrix(grid, TURN_GRID.UP.FIRST);
      mergeNumbers(grid, score);
      rotateMatrix(grid, TURN_GRID.UP.SECOND);
      break;
    default:
      break;
  }
  addRandomTwoOrFour(grid, pLose);
  renderField(grid, trRows);
  addStyleToField(trRows);
  finishedGame(grid, pWin);
}

module.exports = {
  messageWin,
  messageLose,
  fieldRow,
  gameScore,
  startGame,
  keyPressed,
};
