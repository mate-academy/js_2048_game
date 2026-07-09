'use strict';
// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

// const Game = require('../modules/Game.class.js');
const game = new Game();
const start1 = document.querySelector('.button');

function updateUI() {
  const currentStatus = game.getStatus();
  const messagestart = document.querySelector('.message-start');
  const loseMessage = document.querySelector('.message-lose');
  const winmessage = document.querySelector('.message-win');

  if (currentStatus === 'playing') {
    messagestart.classList.add('hidden');
    winmessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  if (currentStatus === 'idle') {
    start1.classList.remove('restart');
    start1.classList.add('start');
    start1.textContent = 'Start';
  } else {
    start1.classList.remove('start');
    start1.classList.add('restart');
    start1.textContent = 'Restart';
  }

  if (currentStatus === 'lose') {
    if (loseMessage) {
      loseMessage.classList.remove('hidden');
    }
    likeloop();
    score();
  } else if (currentStatus === 'win') {
    winmessage.classList.remove('hidden');
    likeloop();
  } else {
    if (loseMessage) {
      loseMessage.classList.add('hidden');
    }
  }
}

start1.addEventListener('click', () => {
  updateUI();

  if (
    game.status === 'lose' ||
    game.status === 'win' ||
    game.status === 'idle' ||
    game.status === 'playing'
  ) {
    game.score = 0;
    game.restart();
    likeloop();
  }

  if (game.status !== 'playing') {
    game.start();
    score();
    likeloop();
  } else if (game.status === 'lose' || game.status === 'win') {
    game.restart();
    likeloop();
  }
  likeloop();
  score();
  updateUI();
});

window.addEventListener('keydown', (e) => {
  updateUI();

  if (game.status !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    likeloop();
    score();
    highscore();
    game.Gameover();
    game.getStatus();
  }
});

window.addEventListener('keydown', (e) => {
  updateUI();

  if (game.status !== 'playing') {
    return;
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    likeloop();
    score();
    highscore();
    game.Gameover();
    game.getStatus();
  }
});

window.addEventListener('keydown', (e) => {
  updateUI();

  if (game.status !== 'playing') {
    return;
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    likeloop();
    score();
    highscore();
    game.Gameover();
    game.getStatus();
  }
});

window.addEventListener('keydown', (e) => {
  updateUI();

  if (game.status !== 'playing') {
    return;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    likeloop();
    score();
    highscore();
    game.Gameover();
    game.getStatus();
  }
});

function score() {
  const scorething = game.getScore();
  const scoreElement = document.querySelector('.game-score');

  if (scoreElement) {
    scoreElement.textContent = scorething;
  }
}

function highscore() {
  const highscoreElement = document.querySelector('.game-highscore');

  if (highscoreElement) {
    highscoreElement.textContent = game.highscore;
  }
}

function likeloop() {
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const value = board[y][x];
      const cellIndex = y * 4 + x;
      const currentCell = cells[cellIndex];

      if (value === 0) {
        currentCell.textContent = '';
        currentCell.className = 'field-cell';
      } else {
        currentCell.textContent = value;
        currentCell.className = `field-cell field-cell--${value}`;
      }
    }
  }
}
updateUI();
