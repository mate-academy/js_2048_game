'use strict';

import Game from '../modules/Game.class';

const game = new Game();

// Write your code here

const start = document.querySelector('.start');
const goodLuck = document.querySelector('.message-start');
let touchStartX = 0;
let touchStartY = 0;

start.addEventListener('click', (e) => {
  if (e.target.textContent === 'Restart') {
    e.target.textContent = 'Start';
    e.target.classList.add('start');
    e.target.classList.remove('restart');

    goodLuck.classList.remove('hidden');

    game.restart();
    game.getScore();
    game.getStatus();
  } else {
    e.target.textContent = 'Restart';
    e.target.classList.add('restart');
    e.target.classList.remove('start');

    goodLuck.classList.add('hidden');

    game.start();
    game.start();
    game.getStatus();
  }
});

document.addEventListener('keydown', (e) => {
  if (start.textContent === 'Restart') {
    if (e.key === 'ArrowUp') {
      game.moveUp();
      game.getScore();
      game.getStatus();
    }

    if (e.key === 'ArrowRight') {
      game.moveRight();
      game.getScore();
      game.getStatus();
    }

    if (e.key === 'ArrowDown') {
      game.moveDown();
      game.getScore();
      game.getStatus();
    }

    if (e.key === 'ArrowLeft') {
      game.moveLeft();
      game.getScore();
      game.getStatus();
    }
  }
});

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) {
      game.moveRight();
      game.getScore();
      game.getStatus();
    } else if (dx < -30) {
      game.moveLeft();
      game.getScore();
      game.getStatus();
    }
  } else {
    if (dy > 30) {
      game.moveDown();
      game.getScore();
      game.getStatus();
    } else if (dy < -30) {
      game.moveUp();
      game.getScore();
      game.getStatus();
    }
  }
});
