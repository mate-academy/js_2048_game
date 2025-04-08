/* eslint-disable no-shadow */
import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const gameField = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateBoard() {
  const state = game.getState();

  gameField.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const status = game.getStatus();

  if (status === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (status === 'win') {
    messageWin.classList.remove('hidden');
  } else if (status === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
  updateBoard();
  updateMessages();
});

document.addEventListener('keydown', (event) => {
  let moved = false;

  switch (event.key) {
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
    updateBoard();
    updateMessages();

    if (game.getStatus() !== 'idle' && startButton.textContent !== 'Restart') {
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
    }
  }
});

updateBoard();
updateMessages();
