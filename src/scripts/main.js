'use strict';

// IMPORT GAME-CLASS
const Game = require('../modules/Game.class');
const game = new Game();

window.game = game;

// ALL FOUND DOM-ELEMENTS
const gameField = document.querySelector('.game-field');
const allRows = document.querySelectorAll('.field-row');
const startBtn = document.querySelector('.start');
const scoreTracer = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messagePlaying = document.querySelector('.message-playing');

// ALL FUNCTION DECLARATIONS
function render(newTiles = []) {
  const state = game.getState();

  allRows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const stateElement = state[rowIndex][cellIndex];

      cell.className = 'field-cell';

      // HERE we destructurize [[row1, cell1], [row2, cell2]]
      // then we have true for 2 out of 16 cells from currentState
      // which correspond two random cells from the start

      const isNew = newTiles.some(([r, c]) => {
        return r === rowIndex && c === cellIndex;
      });

      // for these two cells we add class for smooth animation
      if (isNew) {
        cell.classList.add('field-cell--new');
      }

      if (stateElement !== 0) {
        cell.classList.add(`field-cell--${stateElement}`);
        cell.textContent = stateElement;
      } else {
        cell.textContent = '';
      }
    });
  });

  scoreTracer.textContent = game.getScore();

  if (game.getCountSteps() === 0) {
    startBtn.className = 'button start';
    startBtn.textContent = 'Start Game';
  } else {
    startBtn.className = 'button restart';
    startBtn.textContent = 'Restart Game';
  }

  renderMessage();
}

function renderMessage() {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messagePlaying.classList.add('hidden');

  switch (game.getStatus()) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    case 'playing':
      messagePlaying.classList.remove('hidden');
      break;

    default:
      break;
  }
}

function handleStart() {
  let newTiles = [];

  if (game.getStatus() === 'idle') {
    newTiles = game.start();
  } else {
    newTiles = game.restart();
  }

  render(newTiles);
}

// ALL EVENT LISTENERS
startBtn.addEventListener('click', handleStart);

function moveCell(direction) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const stateBefore = JSON.stringify(game.getState());

  if (direction === 'left') {
    game.moveLeft();
  }

  if (direction === 'right') {
    game.moveRight();
  }

  if (direction === 'up') {
    game.moveUp();
  }

  if (direction === 'down') {
    game.moveDown();
  }

  const stateAfter = JSON.stringify(game.getState());

  if (stateBefore !== stateAfter) {
    const newTile = game.createNewCell();

    game.stepsIncrement();
    render(newTile);
  }
}

document.addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    moveCell('left');
  }

  if (e.key === 'ArrowRight') {
    moveCell('right');
  }

  if (e.key === 'ArrowUp') {
    moveCell('up');
  }

  if (e.key === 'ArrowDown') {
    moveCell('down');
  }
});

let startX;
let startY;
// HERE we find the coordinates of a place that user pressed with a finger

gameField.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

// 1. find the coordinates of a place where user removed a finger
// 2. find the pixel difference to find out in what direction was swipe
// 3. check if ()... < 30) helps to ignore hands trembling and so on.

gameField.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      moveCell('right');
    } else {
      moveCell('left');
    }
  } else {
    if (deltaY > 0) {
      moveCell('down');
    } else {
      moveCell('up');
    }
  }
});
