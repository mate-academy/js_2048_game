'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const scoreDisplay = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function renderBoard() {
  console.table(game.getState());

  gameField.innerHTML = '';
  const field = game.getState();

  field.forEach((row) => {
    const rowElement = document.createElement('tr');
    rowElement.classList.add('field-row');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');
      cellElement.classList.add('field-cell');
      if (cell !== 0) {
        cellElement.classList.add(`field-cell--${cell}`);
        cellElement.textContent = cell;
      }
      rowElement.appendChild(cellElement);
    });

    gameField.appendChild(rowElement);
  });

  scoreDisplay.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  } else if (game.getStatus() === 'lose') {
    winMessage.classList.add('hidden');
    loseMessage.classList.remove('hidden');
    startMessage.classList.add('hidden');
  } else {
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.restart();
    startMessage.classList.add('hidden');
    startButton.textContent = 'Restart';
  }
  renderBoard();
});

document.addEventListener('keydown', (event) => {
  if (game.getStatus() === 'win' || game.getStatus() === 'lose') return;

  if (event.key === 'ArrowLeft') game.moveLeft();
  if (event.key === 'ArrowRight') game.moveRight();
  if (event.key === 'ArrowUp') game.moveUp();
  if (event.key === 'ArrowDown') game.moveDown();

  renderBoard();
});

renderBoard();
