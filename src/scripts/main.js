'use strict';

// Arrow key constants
const ARROW_KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

// DOM elements
const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const gameBoardRows = document.querySelectorAll('tr');
const messages = {
  lose: document.querySelector('.message-lose'),
  win: document.querySelector('.message-win'),
  start: document.querySelector('.message-start'),
};

// Game setup
const Game = require('../modules/Game.class');
const game = new Game();

let isFirstMove = true;

/** Updates the game board with the current game state. */
const updateGameFields = () => {
  const state = game.getState();

  gameBoardRows.forEach((row, rowIndex) => {
    Array.from(row.cells).forEach((cell) => {
      const cellIndex = cell.cellIndex;
      const cellValue = state[rowIndex][cellIndex];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (cellValue !== 0) {
        cell.textContent = cellValue;
        cell.classList.add(`field-cell--${cellValue}`);
      }
    });
  });
};

/** Updates the visible game message based on the current game status. */
const updateMessage = () => {
  Object.values(messages).forEach((message) => message.classList.add('hidden'));

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    messages.win.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messages.lose.classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    messages.start.classList.remove('hidden');
  }
};

/** Updates the game score display. */
const updateScore = () => {
  gameScore.textContent = game.getScore();
};

/** Starts or restarts the game. */
const startGame = () => {
  if (startButton.textContent === 'Start') {
    game.start();
  } else if (startButton.textContent === 'Restart') {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.replace('restart', 'start');
    updateScore();
  }

  updateGameFields();
  updateMessage();
  isFirstMove = true;
};

/** Handles arrow key presses for game moves. */
const handleArrowKey = (e) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  switch (e.key) {
    case ARROW_KEYS.LEFT:
      game.moveLeft();
      break;
    case ARROW_KEYS.RIGHT:
      game.moveRight();
      break;
    case ARROW_KEYS.UP:
      game.moveUp();
      break;
    case ARROW_KEYS.DOWN:
      game.moveDown();
      break;
    default:
      return; // Ignore other keys
  }

  if (isFirstMove) {
    startButton.textContent = 'Restart';
    startButton.classList.replace('start', 'restart');
    isFirstMove = false;
  }

  updateMessage();
  updateGameFields();
  updateScore();
};

// Event listeners
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleArrowKey);
