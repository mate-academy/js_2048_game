'use strict';

import constants from './constants.js';
import { keyController, swipeController } from './keySwipeController.js';
import statusVisibilityController from './statusVisibilityController.js';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const gameField = document.querySelector('.game-field');
const scoreField = document.querySelector('.game-score');

const resetCellClassName = (cell) => {
  const classList = cell.classList;

  for (const item of classList) {
    if (item !== 'field-cell') {
      cell.classList.remove(item);
    }
  }
};

const renderBoard = () => {
  const state = game.getState();

  const rows = gameField.rows;

  for (let i = 0; i < state.length; i++) {
    const fieldRow = rows[i].cells;
    const stateRow = state[i];

    for (let j = 0; j < fieldRow.length; j++) {
      const newValue = stateRow[j];
      const cell = fieldRow[j];

      resetCellClassName(cell);

      if (newValue !== 0) {
        cell.innerHTML = newValue;
        cell.classList.add('field-cell--' + newValue);
      } else {
        cell.innerHTML = '';
      }
    }
  }
  scoreField.innerHTML = game.getScore();
};

const renderCell = (AddNewCellResult) => {
  const { failedToAdd, row, col, value } = AddNewCellResult;

  if (failedToAdd) {
    return;
  }

  const cell = gameField.rows[row].cells[col];

  if (cell) {
    cell.innerHTML = value;
    cell.classList.add('field-cell--' + value);
  }
};

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');

const modificationsAfterFirstMove = () => {
  // change buttons to restart
  statusVisibilityController.switchButtons('.restart');
  // change message to restart
  statusVisibilityController.makeMessageVisible('.message-restart');
};

const handleEndGameEvent = (gameStatus) => {
  if (gameStatus === constants.STATUS.win) {
    statusVisibilityController.makeMessageVisible('.message-win');
  }

  if (gameStatus === constants.STATUS.lose) {
    statusVisibilityController.makeMessageVisible('.message-lose');
  }

  if (gameStatus !== constants.STATUS.playing) {
    statusVisibilityController.defocusField();
  }
  removeMoveEventListeners();
};

const handleMoveEvent = (direction) => {
  if (
    game.getStatus() === constants.STATUS.win ||
    game.getStatus() === constants.STATUS.lose
  ) {
    return;
  }

  const promise = new Promise((resolve, reject) => {
    if (game.checkIfLost()) {
      reject(new Error(constants.STATUS.lose));
    }

    const moveFunction = game.selectMoveFunction(direction);
    const moveProcessed = moveFunction();

    if (moveProcessed) {
      resolve('Moved');
    } else {
      reject(new Error('Move failed'));
    }
  });

  promise
    .then((message) => {
      // eslint-disable-next-line no-console
      console.log(message);

      renderBoard();

      if (game.getMoves() === 1) {
        modificationsAfterFirstMove();
      }

      if (game.getStatus() === constants.STATUS.win) {
        handleEndGameEvent(constants.STATUS.win);

        return;
      }

      setTimeout(() => renderCell(game.addRandomCellValue()), 300);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log({ err });

      if (err.message === constants.STATUS.lose) {
        handleEndGameEvent(constants.STATUS.lose);
      }

      if (err.message === 'Move failed') {
        // eslint-disable-next-line no-console
        console.log(err.message);
      }
    });
};

const handleKeyDownEvent = (e) => {
  const targetKey = e.key;

  if (targetKey && keyController.arrowKeys.hasOwnProperty(targetKey)) {
    const direction = keyController.identifyArrowKeyDirection(targetKey);

    handleMoveEvent(direction);
  }
};

const handleSwipeEvent = (e) => {
  const direction = swipeController.handleTouchEnd(e);

  handleMoveEvent(direction);
};

const handleStartEvent = () => {
  if (game.getStatus() === constants.STATUS.playing) {
    return;
  }

  addMoveEventListeners();

  game.start();
  statusVisibilityController.focusField();
  renderBoard();
};

const handleRestartEvent = () => {
  removeMoveEventListeners();
  addMoveEventListeners();
  statusVisibilityController.makeMessageVisible('.message-restart');
  game.restart();
  renderBoard();
  statusVisibilityController.focusField();
};

const addMoveEventListeners = () => {
  document.addEventListener('keydown', handleKeyDownEvent);

  gameField.addEventListener(
    'touchstart',
    swipeController.handleTouchStart.bind(swipeController),
  );
  gameField.addEventListener('touchend', handleSwipeEvent);

  gameField.addEventListener(
    'touchmove',
    swipeController.preventScrollOnSwipe.bind(swipeController),
  );
};

const removeMoveEventListeners = () => {
  document.removeEventListener('keydown', handleKeyDownEvent);

  gameField.removeEventListener(
    'touchstart',
    swipeController.handleTouchStart.bind(swipeController),
  );
  gameField.removeEventListener('touchend', handleSwipeEvent);

  gameField.removeEventListener(
    'touchmove',
    swipeController.preventScrollOnSwipe.bind(swipeController),
  );
};

startButton.addEventListener('click', handleStartEvent);

restartButton.addEventListener('click', handleRestartEvent);
