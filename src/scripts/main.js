'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game(null);
const startButton = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard(board) {
  board.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell field-cell--${value}`;
  });
}

function renderScore(score) {
  scoreElement.textContent = score;
}

function renderStatus(gameStatus) {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function updateUi() {
  renderBoard(game.getState());
  renderScore(game.getScore());
  renderStatus(game.getStatus());
}

startButton.addEventListener('click', () => {
  game.start();
  updateUi();
  startButton.classList.remove('start');
  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    game.addRandomTile();
    updateUi();
  }
});
