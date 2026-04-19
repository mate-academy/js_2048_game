'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const scoreSpan = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message.message-start');
const gameField = document.querySelector('.game-field');

const renderCells = () => {
  const currentState = game.getState();

  // iterating through rows and columns of our GameTable
  // each cell should have textContent according to currectGameState
  for (let i = 0; i < currentState[0].length; i++) {
    for (let k = 0; k < currentState[i].length; k++) {
      const currentCell = gameField.rows[i].cells[k];
      const currentCellValue = currentCell.textContent;
      const newCellValue = currentState[i][k];

      // adding new Class for new Cell value,
      // removing old one and changing textContent to actual

      currentCell.classList.remove(`field-cell--${currentCellValue}`);

      // if newCellValue = 0,no need to add nothing but field-cell default class
      if (newCellValue) {
        currentCell.classList.add(`field-cell--${newCellValue}`);
      }

      // 0 should not be showed
      gameField.rows[i].cells[k].textContent = newCellValue || '';

      // also update scoreSpan
      scoreSpan.textContent = game.getScore();
    }
  }
};

const startHandler = () => {
  switch (game.getStatus()) {
    case 'idle': {
      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';

      messageStart.classList.add('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      game.start();
      break;
    }

    case 'playing':
    // falls through
    case 'win':
    // falls through

    case 'lose': {
      startButton.classList.remove('restart');
      startButton.classList.add('start');
      startButton.textContent = 'Start';
      game.restart();

      messageStart.classList.remove('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');

      break;
    }

    default:
      break;
  }
  renderCells();
};

const keyboardHandler = (ev) => {
  // if game is not started yet, just ignore key press
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (ev.key) {
    case 'ArrowRight': {
      game.moveRight();
      break;
    }

    case 'ArrowLeft': {
      game.moveLeft();
      break;
    }

    case 'ArrowUp': {
      game.moveUp();
      break;
    }

    case 'ArrowDown': {
      game.moveDown();
      break;
    }

    default:
      break;
  }
  // check game status after each move - if Win or Lose, messages should appear

  switch (game.getStatus()) {
    case 'win': {
      winMessage.classList.remove('hidden');
      break;
    }

    case 'lose': {
      loseMessage.classList.remove('hidden');
      break;
    }
    default:
      break;
  }
  renderCells();
};

document.addEventListener('keydown', keyboardHandler);

startButton.addEventListener('click', startHandler);
