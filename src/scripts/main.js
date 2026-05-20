'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const cell = document.querySelectorAll('.field-cell');
const startBtn = document.querySelector('.start');

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const stateBefore = JSON.stringify(game.getState());

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
    default:
      return;
  }

  const stateAfter = JSON.stringify(game.getState());

  if (stateBefore !== stateAfter) {
    game.spawnTile();
  }
  render();
});

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.replace('start', 'restart');
  } else {
    game.restart();
  }
  render();
});

function render() {
  document.querySelector('.game-score').textContent = game.getScore();

  const getStatus = game.getStatus();

  document
    .querySelector('.message-win')
    .classList.toggle('hidden', getStatus !== 'win');

  document
    .querySelector('.message-lose')
    .classList.toggle('hidden', getStatus !== 'lose');

  document.querySelector('.message-start').classList.add('hidden');

  cell.forEach((item, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    item.textContent =
      game.getState()[row][col] === 0 ? '' : game.getState()[row][col];

    if (game.getState()[row][col] === 0) {
      item.className = 'field-cell';
    } else {
      item.className = `field-cell field-cell--${game.getState()[row][col]}`;
    }
  });
}
