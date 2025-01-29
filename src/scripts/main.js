'use strict';

const Game = require('../modules/Game.class.js');
const game = new Game();
const elements = Array.from(document.querySelectorAll('.field-cell'));
const button = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

button.addEventListener('click', () => {
  game.restart();
  game.start();

  if (button.textContent === 'Start') {
    messageStart.style.display = 'none';
    button.innerHTML = 'Restart';
    button.className = 'button restart';
  }
  updateInformation();
  updateBoard(game.getState());
});

// Реакція на натискання клавіш
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      updateBoard(game.getState());
      updateInformation();
      break;
    case 'ArrowDown':
      game.moveDown();
      updateBoard(game.getState());
      updateInformation();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      updateBoard(game.getState());
      updateInformation();
      break;
    case 'ArrowRight':
      game.moveRight();
      updateBoard(game.getState());
      updateInformation();
      break;
  }
});

function updateBoard(state) {
  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const index = rowIndex * 4 + colIndex;
      const element = elements[index];

      if (value !== 0) {
        element.className = `field-cell field-cell--${value}`;
        element.textContent = `${value}`;
      } else {
        element.className = 'field-cell';
        element.textContent = '';
      }
    });
  });
}

function updateInformation() {
  if (game.status === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  }
  score.innerHTML = `${game.getScore()}`;
}
