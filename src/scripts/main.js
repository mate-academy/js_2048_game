'use strict';

const Game = require('../modules/Game.class');
const { default: initialState } = require('./components/initialState');
const startButton = document.querySelector('.controls button');
const score = document.querySelector('.game-score');

const game = new Game(initialState());

// const game = new Game([
//   [1024, 1024, 16, 8],
//   [0, 2, 2, 4],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
// ]);

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    game.start();
  } else {
    game.restart();
  }

  document.querySelector('.message-start').classList.add('hidden');

  const data = game.getScore();

  score.textContent = data;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    game.moveRight();

    const data = game.getScore();

    score.textContent = data;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();

    const data = game.getScore();

    score.textContent = data;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();

    const data = game.getScore();

    score.textContent = data;
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();

    const data = game.getScore();

    score.textContent = data;
  }
});
