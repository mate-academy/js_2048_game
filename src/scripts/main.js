'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

function renderGame() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  state.flat().forEach((cellValue, index) => {
    const cell = cells[index];

    cell.textContent = cellValue || '';
    cell.className = 'field-cell';

    if (cellValue) {
      cell.classList.add(`field-cell--${cellValue}`);
    }
  });

  const scoreDisplay = document.querySelector('.game-score');

  scoreDisplay.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
  } else if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
    document.querySelector('.message-win').classList.add('hidden');
  } else {
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
  }
}

function startOrRestartGame() {
  const startButton = document.querySelector('.start') || document.querySelector('.restart');;

  if (game.getStatus() !== 'playing') {
    game.start();
  } else {
    game.restart();
  }
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  document.querySelector('.message-start').classList.add('hidden');
  renderGame();
}

function handleKeyPress(e) {
  if (game.getStatus() !== 'playing') {
    return;
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
    default:
      return;
  }
  renderGame();
}

document.querySelector('.start').addEventListener('click', startOrRestartGame);

document.addEventListener('keydown', handleKeyPress);

renderGame();
