'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const container = document.querySelector('.container');
const button = container.querySelector('.button');
const messageStart = container.querySelector('.message-start');
const messageLose = container.querySelector('.message-lose');
const messageWin = container.querySelector('.message-win');
const scoreInfo = container.querySelector('.game-score');

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    game.start();

    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  } else {
    game.restart();
  }

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  updateUI();
});

// ==========================================
let touchStartX, touchStartY;
let touchEndX, touchEndY;

container.addEventListener('touchstart', (swipe) => {
  touchStartX = swipe.touches[0].clientX;
  touchStartY = swipe.touches[0].clientY;
});

container.addEventListener('touchend', (swipe) => {
  touchEndX = swipe.changedTouches[0].clientX;
  touchEndY = swipe.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else {
    if (deltaY > 0) {
      game.moveDown();
    } else {
      game.moveUp();
    }
  }
});
// ==========================================

document.addEventListener('keydown', (keyboard) => {
  switch (keyboard.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      break;
  }

  updateUI();
});

function updateUI() {
  const gameState = game.getState().flat();
  const fieldCells = container.querySelectorAll('.field-cell');

  fieldCells.forEach((fieldCell, index) => {
    const classList = fieldCell.classList;
    const classArray = classList;

    for (const className of classArray) {
      if (className !== 'field-cell') {
        classList.remove(className);
        fieldCell.textContent = '';
      }
    }

    if (gameState[index] !== 0) {
      fieldCell.classList.add(`field-cell--${gameState[index]}`);
      fieldCell.textContent = gameState[index];
    }
  });

  scoreInfo.textContent = game.getScore();

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
}
