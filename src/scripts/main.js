'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = Array.from(document.querySelectorAll('.field-cell'));

let gameStarted = false;

function render() {
  const state = game.getState();
  const flat = state.flat();

  flat.forEach((value, i) => {
    const cell = cells[i];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();
  updateMessages();
}

function updateMessages() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const newStatus = game.getStatus();

  if (newStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (newStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (newStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function handleKey(e) {
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
    render();
  }
}

startButton.addEventListener('click', () => {
  if (!gameStarted) {
    game.start();
    gameStarted = true;
  } else {
    game.restart();
  }

  // Update UI after restarting
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  scoreElement.textContent = '0';
  render();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
});

document.addEventListener('keydown', handleKey);

render();
