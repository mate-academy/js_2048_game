'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game2048 = new Game();

const button = document.querySelector('.button');

button.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    game2048.start();
    e.target.classList.replace('start', 'restart');
    e.target.textContent = 'Restart';
    checkStatus(game2048.status);
  } else if (e.target.classList.contains('restart')) {
    game2048.restart();
    e.target.classList.replace('restart', 'start');
    e.target.textContent = 'Start';
    score.textContent = game2048.score;
    checkStatus(game2048.status);
  }
});

const score = document.querySelector('.game-score');

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game2048.moveLeft();
    score.textContent = game2048.score;
    checkStatus(game2048.status);
  }

  if (e.key === 'ArrowRight') {
    game2048.moveRight();
    score.textContent = game2048.score;
    checkStatus(game2048.status);
  }

  if (e.key === 'ArrowUp') {
    game2048.moveUp();
    score.textContent = game2048.score;
    checkStatus(game2048.status);
  }

  if (e.key === 'ArrowDown') {
    game2048.moveDown();
    score.textContent = game2048.score;
    checkStatus(game2048.status);
  }
});

function checkStatus(st) {
  const start = document.querySelector('.message.message-start');
  const win = document.querySelector('.message.message-win');
  const lose = document.querySelector('.message.message-lose');

  if (st === 'win') {
    win.classList.remove('hidden');
    start.classList.add('hidden');
    lose.classList.add('hidden');
  } else if (st === 'lose') {
    lose.classList.remove('hidden');
    start.classList.add('hidden');
    win.classList.add('hidden');
  } else if (st === 'idle' || st === 'playing') {
    start.classList.remove('hidden');
    win.classList.add('hidden');
    lose.classList.add('hidden');
  }
}
