'use strict';

const {
  addRandomTwoOrFour,
  resetField,
  finishedGame,
} = require('./helpers');
const {
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
} = require('./move');

const fieldRow = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function startGame(event, grid, trRows, pLose, pWin) {
  const target = event.target.closest('.button');
  const pStart = document.querySelector('.message-start');

  if (target.classList.contains('start')) {
    target.classList.toggle('start', false);
    target.classList.add('restart');
    target.innerText = 'Restart';

    pStart.hidden = true;
  } else {
    resetField(grid, trRows);

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
      moveRight(grid, trRows, score, pLose);
      finishedGame(grid, pWin);
      break;
    case 'ArrowLeft':
      moveLeft(grid, trRows, score, pLose);
      finishedGame(grid, pWin);
      break;
    case 'ArrowDown':
      moveDown(grid, trRows, score, pLose);
      finishedGame(grid, pWin);
      break;
    case 'ArrowUp':
      moveUp(grid, trRows, score, pLose);
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
