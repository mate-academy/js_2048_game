'use strict';

import Game from '../modules/Game.class';

const game = new Game();

let isFirstRender = true;

// Returns changed rows and columns
const getNewNumbers = () => {
  const currentState = game.getState();
  const previousState = game.getPreviousState();
  /**
   * compares the previous and current state,
   * returns an array of changed cells, otherwise an empty array
   *
   * For example:
   *   [
   *     { rowIndex: 0, cellIndex: 1, newValue: 2 },
   *     { rowIndex: 1, cellIndex: 3, newValue: 64 },
   *     { rowIndex: 1, cellIndex: 2, newValue: 128 },
   *   ]
   */
  const result = currentState.reduce((changedIndices, row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (isFirstRender || cell !== previousState[rowIndex][cellIndex]) {
        changedIndices.push({
          rowIndex: rowIndex,
          cellIndex: cellIndex,
          newValue: cell,
        });
      }
    });

    return changedIndices;
  }, []);

  if (isFirstRender) {
    isFirstRender = false;
  }

  return result;
};

// Sets new numbers on page
const setChangedCells = () => {
  const allRows = document.querySelectorAll('.field-row');
  const changedCells = getNewNumbers();

  // Checks if all cells are equal to 0
  const gameIsRestarted = Game.getEmptyCells(game.getState()).length === 16;

  changedCells.forEach(({ rowIndex, cellIndex, newValue }) => {
    const columnsInRow = allRows[rowIndex].querySelectorAll('.field-cell');
    const cell = columnsInRow[cellIndex];

    cell.className = 'field-cell';
    cell.textContent = gameIsRestarted || newValue === 0 ? '' : newValue;

    if (!gameIsRestarted && newValue !== 0) {
      cell.classList.add(`field-cell--${newValue}`);
    }
  });

  // Updates the score on page after each move
  const gameScore = game.getScore();

  document.querySelector('.game-score').textContent = gameScore;
};

// Displays message <p> and sets styles
const updateGameStatus = (currentStatus) => {
  const messages = {
    lose: document.querySelector('.message-lose'),
    win: document.querySelector('.message-win'),
    idle: document.querySelector('.message-start'),
  };

  // Hide all messages first
  Object.values(messages).forEach((message) => {
    message.classList.add('hidden');
  });

  // Show the appropriate message
  if (messages[currentStatus]) {
    messages[currentStatus].classList.remove('hidden');
  }

  // Update start button
  if (currentStatus === 'idle') {
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }

  if (currentStatus === 'playing') {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }

  if (currentStatus === 'lose') {
    document.removeEventListener('keydown', handleKeyDown);
  }

  if (currentStatus === 'win') {
    document.removeEventListener('keydown', handleKeyDown);
  }
};

const handleKeyDown = (e) => {
  const key = e.key;

  const moves = {
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
  };

  if (moves[key]) {
    moves[key](); // Calls the appropriate method
    setChangedCells(); //  Updates cells after each movement
    updateGameStatus(game.getStatus()); // Updates status
  }
};

const startButton = document.querySelector('.start');

let gameStarted = false;

// Start game
startButton.addEventListener('click', () => {
  gameStarted = !gameStarted;

  // If game stopped
  if (!gameStarted) {
    game.restart();

    // Sets new numbers on page
    setChangedCells();

    // Checks game status and update message
    updateGameStatus(game.getStatus());

    // Turnes off listening for keyboard events
    document.removeEventListener('keydown', handleKeyDown);

    return;
  }

  // Generates 2 cells at the beginning
  game.start();
  setChangedCells();
  updateGameStatus(game.getStatus());

  // Turnes on listening for keyboard events
  document.addEventListener('keydown', handleKeyDown);
});
