'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.start');

const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function render() {
  gameField.innerHTML = '';

  game.getState().forEach((row) => {
    const rowElement = document.createElement('tr');

    row.forEach((cellValue) => {
      const cell = document.createElement('td');

      cell.className = `field-cell field-cell--${cellValue || '0'}`;
      cell.textContent = cellValue || '';
      rowElement.appendChild(cell);
    });
    gameField.appendChild(rowElement);
  });
  scoreDisplay.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else {
    messageWin.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    messageStart.classList.remove('hidden');
  } else {
    messageStart.classList.add('hidden');
  }
}

function handleKeydown(e) {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }
  render();
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.textContent = 'Restart';
    render();
  } else {
    game.restart();
    startButton.textContent = 'Restart';
    render();
  }
});

document.addEventListener('keydown', handleKeydown);
