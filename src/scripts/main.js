'use strict';

/* global Game */

const game = new Game();

const cellsNodeList = document.querySelectorAll('.field-cell');
const cells = [];

for (let i = 0; i < cellsNodeList.length; i++) {
  cells.push(cellsNodeList[i]);
}

const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const valueClassPrefix = 'field-cell--';

function statesEqual(stateA, stateB) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (stateA[row][col] !== stateB[row][col]) {
        return false;
      }
    }
  }

  return true;
}

function renderBoard() {
  const state = game.getState();

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];

    cell.textContent = value ? String(value) : '';

    const classesToRemove = [];

    for (let j = 0; j < cell.classList.length; j++) {
      const className = cell.classList[j];

      if (className.indexOf(valueClassPrefix) === 0) {
        classesToRemove.push(className);
      }
    }

    for (let j = 0; j < classesToRemove.length; j++) {
      cell.classList.remove(classesToRemove[j]);
    }

    if (value) {
      cell.classList.add(valueClassPrefix + value);
    }
  }

  scoreEl.textContent = game.getScore() ? String(game.getScore()) : '';
}

function showStatusMessage() {
  const gameStatus = game.getStatus();

  if (gameStatus !== 'idle') {
    messageStart.classList.add('hidden');
  } else {
    messageStart.classList.remove('hidden');
  }

  if (gameStatus !== 'win') {
    messageWin.classList.add('hidden');
  } else {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus !== 'lose') {
    messageLose.classList.add('hidden');
  } else {
    messageLose.classList.remove('hidden');
  }
}

function setButtonToStart() {
  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
}

function setButtonToRestart() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
}

function updateButton() {
  if (game.getStatus() === 'idle') {
    setButtonToStart();
  } else {
    setButtonToRestart();
  }
}

function handleMove(direction) {
  if (game.getStatus() !== 'playing') {
    return;
  }

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

  renderBoard();
  showStatusMessage();
}

button.addEventListener('click', function () {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  renderBoard();
  showStatusMessage();
  updateButton();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    handleMove('left');
  }

  if (e.key === 'ArrowRight') {
    handleMove('right');
  }

  if (e.key === 'ArrowUp') {
    handleMove('up');
  }

  if (e.key === 'ArrowDown') {
    handleMove('down');
  }
});

renderBoard();
showStatusMessage();

updateButton();
