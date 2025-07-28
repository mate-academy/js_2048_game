'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
import { Game } from '../modules/Game.class';

const game = new Game();
const startButton = document.querySelector('button.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  messageLose.classList.add('hidden');
  game.restart();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  renderBoard(game.getState());
  updateGameStatus();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;

    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;

    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;

    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
  }

  if (moved) {
    renderBoard(game.getState());
    updateGameStatus();
  }
});

function renderBoard(board) {
  const cells = document.querySelectorAll('.field-cell');

  board.flat().forEach((value, index) => {
    cells[index].textContent = value || '';
    cells[index].className = `field-cell field-cell--${value}`;
  });

  const scoreElement = document.querySelector('.game-score');

  if (scoreElement) {
    scoreElement.textContent = game.getScore();
  }
}

function renderScore(score) {
  const scoreEl = document.querySelector('.game-score');

  scoreEl.textContent = score;
}

function updateGameStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    alert('Comgratulation! You win!');
  }
}

startButton.addEventListener('click', () => {
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');
  game.restart();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  renderBoard(game.getState());
  renderScore(game.getScore());
  updateGameStatus();
});
