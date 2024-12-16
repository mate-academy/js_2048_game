/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');
const gameField = document.querySelector('.game-field');
const scoreContainer = document.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
    render();
  }
});

restartButton.addEventListener('click', () => {
  game.restart();
  startButton.classList.remove('hidden');
  restartButton.classList.add('hidden');
  render();
});

document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 37: // Left arrow
      game.moveLeft();
      break;
    case 38: // Up arrow
      game.moveUp();
      break;
    case 39: // Right arrow
      game.moveRight();
      break;
    case 40: // Down arrow
      game.moveDown();
      break;
    default:
      break;
  }
  render();
});

function render() {
  const board = game.getState();
  const score = game.getScore();
  const status = game.getStatus();

  // Update game field UI
  const cells = gameField.querySelectorAll('.field-cell');

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = cells[rowIndex * 4 + colIndex];

      cellElement.textContent = cell === 0 ? '' : cell;
      cellElement.className = `field-cell field-cell--${cell || ''}`;
    });
  });

  // Update score
  scoreContainer.textContent = score;

  // Show win/lose message
  if (status === 'win') {
    messageContainer.querySelector('.message-win').classList.remove('hidden');
  } else if (status === 'lose') {
    messageContainer.querySelector('.message-lose').classList.remove('hidden');
  }
}



