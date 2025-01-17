'use strict';

const Game = require('../modules/Game.class');

const game = new Game([
  [0, 2, 0, 0],
  [0, 4, 4, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const gameBody = document.querySelector('.game-field tbody');
const gameHeader = document.querySelector('.game-header');
const button = gameHeader.querySelector('.button');
const gameScore = document.querySelector('.game-score');

function updateBoard() {
  gameBody.innerHTML = '';

  game.getState().forEach((row) => {
    const rowElement = document.createElement('tr');

    rowElement.classList.add('field-row');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');

      cellElement.classList.add('field-cell');

      if (cell > 0) {
        cellElement.classList.add(`field-cell--${cell}`);
      }

      cellElement.textContent = cell === 0 ? '' : cell;
      rowElement.appendChild(cellElement);
    });
    gameBody.appendChild(rowElement);
  });
  gameScore.textContent = `${game.getScore()}`;
}

function ifMaxScore() {
  if (game.getStatus() === 'win') {
    removeEventListeners();
    document.querySelector('.message-win').classList.remove('hidden');
  }
}

function ifStateBlocked() {
  document.querySelector('.message-lose').classList.remove('hidden');
}

function are2DArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((subArr1, index) => {
    const subArr2 = arr2[index];

    if (subArr1.length !== subArr2.length) {
      return false;
    }

    return subArr1.every((value, subIndex) => value === subArr2[subIndex]);
  });
}

function clickOnButton() {
  if (button.classList.contains('start')) {
    const messageStart = document.querySelector('.message-start');

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'restart';
    messageStart.classList.add('hidden');

    const gameField = document.querySelector('.game-field');
    const cells = gameField.querySelectorAll('.field-cell');
    const regularArray = game.initialState.flat();

    document.querySelector('.game-score').textContent = 0;

    cells.forEach((cell, index) => {
      if (regularArray[index] > 0) {
        cell.textContent = regularArray[index];

        cell.classList.add(`field-cell--${regularArray[index]}`);
      }
    });

    game.start();
    updateBoard();
    addEventListeners();
  } else {
    game.restart();

    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');

    updateBoard();

    addEventListeners();
  }
}

button.addEventListener('click', clickOnButton);

function moveLeft() {
  if (event.key === 'ArrowLeft') {
    game.moveLeft();

    updateBoard();

    ifMaxScore();

    if (game.getStatus === 'lose') {
      ifStateBlocked();
    }

    updateBoard();
  }
}

function moveRight() {
  if (event.key === 'ArrowRight') {
    const firstState = game.getState();

    game.moveRight();

    const secondState = game.getState();

    updateBoard();

    ifMaxScore();

    if (!game.canCellsMove(game.getState())) {
      ifStateBlocked();
    }

    if (!are2DArraysEqual(firstState, secondState)) {
      game.addRandomCell();
      updateBoard();
    }
  }
}

function moveUp() {
  if (event.key === 'ArrowUp') {
    const firstState = game.getState();

    game.moveUp();

    const secondState = game.getState();

    updateBoard();

    ifMaxScore();

    if (!game.canCellsMove(game.getState())) {
      ifStateBlocked();
    }

    if (!are2DArraysEqual(firstState, secondState)) {
      game.addRandomCell();
      updateBoard();
    }
  }
}

function moveDown() {
  if (event.key === 'ArrowDown') {
    const firstState = game.getState();

    game.moveDown();

    const secondState = game.getState();

    updateBoard();

    ifMaxScore();

    if (!game.canCellsMove(game.getState())) {
      ifStateBlocked();
    }

    if (!are2DArraysEqual(firstState, secondState)) {
      game.addRandomCell();
      updateBoard();
    }
  }
}

function removeEventListeners() {
  document.removeEventListener('keydown', moveLeft);
  document.removeEventListener('keydown', moveRight);
  document.removeEventListener('keydown', moveUp);
  document.removeEventListener('keydown', moveDown);
}

function addEventListeners() {
  document.addEventListener('keydown', moveLeft);
  document.addEventListener('keydown', moveRight);
  document.addEventListener('keydown', moveUp);
  document.addEventListener('keydown', moveDown);
}
