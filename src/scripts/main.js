// src/scripts/main.js
import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = Array.from(document.querySelectorAll('.field-cell'));

let gameStarted = false;

function render() {
  const state =
    game.getState() || Array.from({ length: 4 }, () => Array(4).fill(0));
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

  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
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

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  render();
});

document.addEventListener('keydown', handleKey);

render();
