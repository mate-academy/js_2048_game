'use strict';

const customGame = [
  [128, 128, 0, 8],
  [16, 8, 16, 32],
  [8, 16, 32, 64],
  [16, 32, 0, 128],
];

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game(customGame);

const BOARD_SIZE = 4;
const GOAL_OF_VICTORY = 2048;

const table = document.querySelector('.game-field');

const button = document.querySelector('.button');
const startTitle = document.querySelector('.message-start');
const winTitle = document.querySelector('.message-win');
const loseTitle = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');

button.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    game.start();
    renderButton();
    renderStartTitle();
    render();
  } else {
    if (!winTitle.classList.contains('hidden')) {
      winTitle.classList.add('hidden');
    } else if (!loseTitle.classList.contains('hidden')) {
      loseTitle.classList.add('hidden');
    }

    game.restart();
    renderButton();
    renderStartTitle();
    render();
  }
});

function renderButton() {
  if (button.classList.contains('start')) {
    button.className = 'button restart';
    button.textContent = 'Restart';
  } else {
    button.className = 'button start';
    button.textContent = 'Start';
  }
}

function renderStartTitle() {
  startTitle.classList.toggle('hidden');
}

function renderWinTitle() {
  winTitle.classList.remove('hidden');
}

function renderLoseTitle() {
  loseTitle.classList.remove('hidden');
}

function renderScore() {
  gameScore.textContent = String(game.getScore());
}

let prevState = null;

function render() {
  const state = game.getState();
  const spawn = game.lastSpawn;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = state[row][col];
      const prev = prevState ? prevState[row][col] : 0;
      const cell = table.rows[row].cells[col];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (value === 0) {
        continue;
      }

      cell.textContent = String(value);
      cell.classList.add(`field-cell--${value}`);

      const isSpawned = prevState
        ? true
        : spawn && spawn.row === row && spawn.col === col;

      const isMerged = prev !== 0 && value === prev * 2;

      if (isSpawned) {
        cell.classList.add('field-cell-new');
      } else if (isMerged) {
        cell.classList.add('field-cell-merged');
      }
    }
  }

  prevState = state.map((row) => [...row]);

  renderScore();
}

document.addEventListener('keydown', (e) => {
  const state = game.getState();
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      moved = game.moveLeft(state, false);
      break;

    case 'ArrowRight':
      e.preventDefault();
      moved = game.moveRight(state, false);
      break;

    case 'ArrowUp':
      e.preventDefault();
      moved = game.moveUp(state, false);
      break;

    case 'ArrowDown':
      e.preventDefault();
      moved = game.moveDown(state, false);
      break;
  }

  if (moved) {
    render();

    if (game.isGameOver()) {
      renderLoseTitle();
    }

    if (game.getScore() >= GOAL_OF_VICTORY) {
      renderWinTitle();
    }
  }
});
