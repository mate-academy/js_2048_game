'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start.button');
const gameScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
let startX = 0;
let startY = 0;

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'playing') {
    game.restart();

    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  } else {
    game.start();

    startButton.textContent = 'Restart';
    startButton.classList.replace('start', 'restart');
    startMessage.classList.add('hidden');
  }

  updateGameField();
});

const gameField = document.querySelector('.game-field');

function updateGameField() {
  const state = game.getState();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      const cell = gameField.rows[i].cells[j];
      const value = state[i][j];

      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  gameScore.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

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
    updateGameField();
  }
});

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];

  startX = touch.clientX;
  startY = touch.clientY;
});

document.addEventListener('touchend', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const touch = e.changedTouches[0];
  const endX = touch.clientX;
  const endY = touch.clientY;

  const diffX = endX - startX;
  const diffY = endY - startY;

  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);

  // мінімальна довжина свайпу
  if (Math.max(absX, absY) < 30) {
    return;
  }

  let moved = false;

  if (absX > absY) {
    // горизонтальний свайп
    moved = diffX > 0 ? game.moveRight() : game.moveLeft();
  } else {
    // вертикальний свайп
    moved = diffY > 0 ? game.moveDown() : game.moveUp();
  }

  if (moved) {
    updateGameField();
  }
});
