'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const logo = document.querySelector('.logo');
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');
const startBtn = document.querySelector('.start');
const loseMessage = messageContainer.querySelector('.message-lose');
const winMessage = messageContainer.querySelector('.message-win');
const startMessage = messageContainer.querySelector('.message-start');

function render() {
  const state = game.getState().flat();
  const currentStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  if (scoreElement) {
    scoreElement.textContent = game.getScore();
  }

  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  if (startMessage) {
    startMessage.classList.add('hidden');
  }

  if (currentStatus === 'playing') {
    messageContainer.classList.add('hidden');
  } else if (currentStatus === 'idle') {
    messageContainer.classList.remove('hidden');

    if (startMessage) {
      startMessage.classList.remove('hidden');
    }
  } else if (currentStatus === 'win') {
    messageContainer.classList.remove('hidden');
    winMessage.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    messageContainer.classList.remove('hidden');
    loseMessage.classList.remove('hidden');
  }

  if (currentStatus !== 'idle') {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }
}

startBtn.addEventListener('click', () => {
  game.restart();
  render();
});

logo.addEventListener('click', () => {
  document.body.style.transition = '0.1s';
  document.body.style.filter = 'invert(1)';
  alert('БУУУУУУУУУ, ИСПУГАЛСЯ?');

  setInterval(() => {
    document.body.style.transform = `translate(${Math.random() * 10}px, ${Math.random() * 10}px)`;
  }, 50);
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (moved) {
    render();
  }
});
