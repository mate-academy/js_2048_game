'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const button = document.querySelector('.button.start');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart Game';
  } else if (button.classList.contains('restart')) {
    game.restart();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start Game';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && game.getStatus() === 'playing') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown' && game.getStatus() === 'playing') {
    game.moveDown();
  }

  if (e.key === 'ArrowLeft' && game.getStatus() === 'playing') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight' && game.getStatus() === 'playing') {
    game.moveRight();
  }

  game.checkWin();
  game.checkLose();
});

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener(
  'touchmove',
  (e) => {
    if (game.getStatus() === 'playing') {
      e.preventDefault();
    }
  },
  {
    passive: false,
  },
);

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
});

function handleSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (game.getStatus() !== 'playing') {
    return;
  }

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 50) {
      game.moveRight();
    } else if (diffX < -50) {
      game.moveLeft();
    }
  } else {
    if (diffY > 50) {
      game.moveDown();
    } else if (diffY < -50) {
      game.moveUp();
    }
  }

  game.checkWin();
  game.checkLose();
}
