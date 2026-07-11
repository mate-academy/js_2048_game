'use strict';
import Game from '../modules/Game.class';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreGame = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const updateDom = () => {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreGame.textContent = score;

  cells.forEach((cell, index) => {
    const rowIndex = Math.floor(index / 4);
    const colIndex = index % 4;
    const cellValue = state[rowIndex][colIndex];

    cell.textContent = '';
    cell.className = 'field-cell';

    if (cellValue !== 0) {
      cell.textContent = cellValue;
      cell.classList.add(`field-cell--${cellValue}`);
    }
  });

  // Логіка додавання/видалення класу hidden
  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  // Чітке додавання потрібних класів для тестів Cypress
  if (gameStatus === 'idle') {
    mainButton.textContent = 'Start';
    mainButton.classList.remove('restart');
    mainButton.classList.add('start');
  } else {
    mainButton.textContent = 'Restart';
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
  }
};

mainButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateDom();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;
    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;
    default:
      return;
  }
  updateDom();
});

updateDom();
