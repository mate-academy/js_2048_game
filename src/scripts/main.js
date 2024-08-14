'use strict';

const Game = require('../modules/Game.class');
const buttonStart = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const COLUMNS = 4;
const ROWS = 4;
const game = new Game();

// слухаємо події
document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
    updateInterface();
  }
});

// міняємо інтерфейс
function updateInterface() {
  let i = 0;
  const state = game.getState();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const cell = cells[i];

      cell.className = 'field-cell';

      if (state[row][col]) {
        cell.textContent = state[row][col];
        cell.classList.add(`field-cell--${state[row][col]}`);
      } else {
        cell.textContent = '';
      }
      i++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  const statusGame = game.getStatus();

  if (statusGame === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (statusGame === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

// міняємо кнопку
buttonStart.addEventListener('click', () => {
  if (buttonStart.className === 'button restart') {
    game.restart();
  }

  game.start();
  updateInterface();
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-start').classList.add('hidden');
  buttonStart.textContent = 'Restart';
  buttonStart.className = 'button restart';
});
