'use strict';

import Game, { useLocalStorage } from '../modules/Game.class';

const game = new Game();

// Write your code here
const startRestart = document.getElementsByClassName('button')[0];
const message = document.getElementsByClassName('message');
const bestScore = document.querySelector('.best');
const [score] = useLocalStorage('gameScore', 0);

bestScore.textContent = score;

// let touchStartX = null;
// let touchEndX = null;
// let touchStartY = null;
// let touchEndY = null;

startRestart.onclick = () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    startRestart.classList.remove('start');
    startRestart.classList.add('restart');

    startRestart.textContent = 'Restart';

    message[2].classList.toggle('hidden');

    game.start();
  }

  if (gameStatus === 'playing') {
    game.restart();
  }

  if (gameStatus === 'lose') {
    game.restart();
    message[0].classList.toggle('hidden');
  }

  if (gameStatus === 'win') {
    game.restart();
    message[1].classList.toggle('hidden');
  }
};

const keydownHandler = (e) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (game.getStatus() === 'lose') {
    message[0].classList.toggle('hidden');
    removeEventListener('keydown', keydownHandler);
  }

  if (game.getStatus() === 'win') {
    message[1].classList.toggle('hidden');
    removeEventListener('keydown', keydownHandler);
  }
};

addEventListener('keydown', keydownHandler);

// Обробники для свайпів
let touchStartX = null;
let touchStartY = null;

const touchStartHandler = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const touchEndHandler = (e) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else if (Math.abs(deltaY) > 50) {
    if (deltaY > 0) {
      game.moveDown();
    } else {
      game.moveUp();
    }
  }

  if (game.getStatus() === 'lose') {
    message[0].classList.toggle('hidden');
    removeEventListener('touchstart', touchStartHandler);
    removeEventListener('touchend', touchEndHandler);
  }

  if (game.getStatus() === 'win') {
    message[1].classList.toggle('hidden');
    removeEventListener('touchstart', touchStartHandler);
    removeEventListener('touchend', touchEndHandler);
  }
};

addEventListener('touchstart', touchStartHandler);
addEventListener('touchend', touchEndHandler);
