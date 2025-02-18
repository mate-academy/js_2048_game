'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

// Создаём объект игры с начальным состоянием
const game2048 = new Game();

const controls = document.getElementsByClassName('container')[0];

controls.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    game2048.start();

    e.target.classList.replace('start', 'restart');
    e.target.textContent = 'Restart';
  } else if (e.target.classList.contains('restart')) {
    game2048.restart();
    e.target.classList.replace('restart', 'start');
    e.target.textContent = 'Start';
  }
});

const score = document.getElementsByClassName('game-score')[0];

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game2048.moveLeft();
    score.textContent = game2048.score;
  }

  if (e.key === 'ArrowRight') {
    game2048.moveRight();
    score.textContent = game2048.score;
  }

  if (e.key === 'ArrowUp') {
    game2048.moveUp();
    score.textContent = game2048.score;
  }

  if (e.key === 'ArrowDown') {
    game2048.moveDown();
    score.textContent = game2048.score;
  }
});
