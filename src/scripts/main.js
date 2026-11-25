'use strict';

// Uncomment the next lines to use your game instance in the browser
// const game = new Game();

// Write your code here
const Game = require('../modules/Game.class');
const game = new Game();

function render() {
  const cells = document.querySelectorAll('.field-cell');
  const states = game.getState();

  for (let i = 0; i < states.length; i++) {
    for (let j = 0; j < states[i].length; j++) {
      const cell = cells[i * 4 + j];
      const value = states[i][j];

      cell.textContent = value === 0 ? '' : value;
      cell.className = `field-cell field-cell--${value}`;
    }
  }
  // atualiza o score na tela
  document.querySelector('.game-score').textContent = game.getScore();

  const gameStatus = game.getStatus();

  document
    .querySelector('.message-start')
    .classList.toggle('hidden', gameStatus !== 'idle');

  document
    .querySelector('.message-win')
    .classList.toggle('hidden', gameStatus !== 'win');

  document
    .querySelector('.message-lose')
    .classList.toggle('hidden', gameStatus !== 'lose');
}

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'playing' && startButton.textContent === 'Start') {
    return;
  }

  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
  render();
});

function makeMove(move) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const changed = move();

  if (changed) {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
  render();
}

document.addEventListener('keydown', (ev) => {
  switch (ev.key) {
    case 'ArrowLeft':
      makeMove(() => game.moveLeft());
      break;
    case 'ArrowRight':
      makeMove(() => game.moveRight());
      break;
    case 'ArrowUp':
      makeMove(() => game.moveUp());
      break;
    case 'ArrowDown':
      makeMove(() => game.moveDown());
      break;
    default:
  }
});
