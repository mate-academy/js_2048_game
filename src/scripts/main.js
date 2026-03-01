'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

// Write your code here
// game.start();

const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

// Кольори для чисел (можеш додати більше)
const colors = {
  0: '#cdc1b4',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

// Функція рендеру гри
function render() {
  const state = game.getState();
  let i = 0;

  for (let r = 0; r < game.size; r++) {
    for (let c = 0; c < game.size; c++) {
      const value = state[r][c];

      cells[i].textContent = value === 0 ? '' : value;
      cells[i].style.backgroundColor = colors[value] || '#3c3a32';
      i++;
    }
  }

  // scoreEl.textContent = game.getScore();
  const totalScore = state.flat().reduce((sum, val) => sum + val, 0);

  scoreEl.textContent = totalScore;

  messageStart.classList.add('hidden');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
}

// Клавіші для гри
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return; // гра не розпочата — игноруємо клавіші
  }

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
});

// Кнопка Start
// document.querySelector('.button.start').addEventListener('click', () => {
//   game.restart();
//   render();
// });
const startButton = document.querySelector('.button');

startButton.addEventListener('click', () => {
  game.restart();
  render();
  startButton.textContent = 'Restart';
});

// Початковий рендер
render();
