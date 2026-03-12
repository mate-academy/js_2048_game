'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    game.start();
    game.getScore();
  } else {
    game.restart();
    game.getScore();
  }
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    game.newElement();
    game.getScore();
    game.statusGame();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    game.newElement();
    game.getScore();
    game.statusGame();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    game.newElement();
    game.getScore();
    game.statusGame();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    game.newElement();
    game.getScore();
    game.statusGame();
  }
});

let startX = 0;
let endX = 0;
let startY = 0;
let endY = 0;

document.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;
  touch();
});

function touch() {
  if (startX - endX >= 70) {
    game.moveLeft();
    game.newElement();
    game.getScore();
    game.statusGame();
  } else if (startX - endX <= -70) {
    game.moveRight();
    game.newElement();
    game.getScore();
    game.statusGame();
  } else if (startY - endY >= 70) {
    game.moveUp();
    game.newElement();
    game.getScore();
    game.statusGame();
  } else if (startY - endY <= -70) {
    game.moveDown();
    game.newElement();
    game.getScore();
    game.statusGame();
  }
}
