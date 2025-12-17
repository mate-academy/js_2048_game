'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');
const startMsg = document.querySelector('.message-start');

function render() {
  const state = game.getState();
  const score = game.getScore();

  cells.forEach((cell, i) => {
    const val = state[Math.floor(i / 4)][i % 4];

    cell.textContent = val === 0 ? '' : val;
    cell.className = 'field-cell';

    if (val > 0) {
      cell.classList.add(`field-cell--${val}`);
    }
  });

  scoreEl.textContent = score;

  msgVictory();
}

function isGameView() {
  if (game.isGameOver()) {
    loseMsg.classList.remove('hidden');
  }
}

function msgVictory() {
  if (game.messageOfVictory()) {
    winMsg.classList.remove('hidden');
  }
}

function saveGame() {
  localStorage.setItem('gameState', JSON.stringify(game.getState()));
  localStorage.setItem('gameScore', game.getScore());
}

function loadGame() {
  const savedField = localStorage.getItem('gameState');
  const savedScore = localStorage.getItem('gameScore');

  if (savedField) {
    game.setState(JSON.parse(savedField));
    game.setScore(savedScore ? Number(savedScore) : 0);
    game.status = 'playing';

    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
    startMsg.classList.add('hidden');
  }
}

loadGame();
render();

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }

  render();
  saveGame();

  startMsg.classList.add('hidden');
  winMsg.classList.add('hidden');
  loseMsg.classList.add('hidden');

  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';
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
    default:
      return;
  }

  if (moved) {
    game.addRandomTile();
    saveGame();
  }

  render();
  isGameView();
  msgVictory();
});
