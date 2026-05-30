'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let hasMoved = false;

function boardsEqual(b1, b2) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (b1[r][c] !== b2[r][c]) {
        return false;
      }
    }
  }

  return true;
}

function updateUI() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = state[r][c];
      const cell = cells[r * 4 + c];

      cell.className = 'field-cell';

      if (val > 0) {
        cell.innerText = val.toString();
        cell.classList.add(`field-cell--${val}`);
      } else {
        cell.innerText = '';
      }
    }
  }

  const score = game.getScore();

  if (score === 0) {
    scoreElement.innerText = '0';
    scoreElement.value = '';
    scoreElement.setAttribute('value', '');
  } else {
    scoreElement.innerText = score.toString();
    scoreElement.value = score.toString();
    scoreElement.setAttribute('value', score.toString());
  }

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    updateUI();
  } else if (button.classList.contains('restart')) {
    game.restart();
    hasMoved = false;
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerText = 'Start';
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    updateUI();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const originalBoard = game.getState().map((row) => [...row]);
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
    case 'Left':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
    case 'Right':
      game.moveRight();
      moved = true;
      break;
    case 'ArrowUp':
    case 'Up':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
    case 'Down':
      game.moveDown();
      moved = true;
      break;
    default:
      return;
  }

  if (moved) {
    const newBoard = game.getState();

    if (!boardsEqual(originalBoard, newBoard)) {
      if (!hasMoved) {
        hasMoved = true;
        button.classList.remove('start');
        button.classList.add('restart');
        button.innerText = 'Restart';
      }

      updateUI();
    }
  }
});

// Initialize UI to match initial game state
updateUI();
