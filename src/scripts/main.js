'use strict';

import Game, { setCells, useLocalStorage } from '../modules/Game.class';

const game = new Game();

// Write your code here
const startRestart = document.getElementsByClassName('button')[0];
const message = document.getElementsByClassName('message');
const bestScore = document.querySelector('.best');
const currentScoreTile = [...document.getElementsByClassName('game-score')][1];

const [score] = useLocalStorage('bestScore', 0);
const [currentScore] = useLocalStorage('currentScore', 0);
const [state] = useLocalStorage('gameState', game.startState);
const [gameStatus] = useLocalStorage('gameStatus', 'idle');

if (gameStatus === 'playing') {
  game.currentState = state;
  game.currentScore = currentScore;
  currentScoreTile.textContent = currentScore;
  setCells(state.flat());
  game.gameStatus = gameStatus;

  startRestart.classList.remove('start');
  startRestart.classList.add('restart');

  startRestart.textContent = 'Restart';

  message[2].classList.toggle('hidden');
}

bestScore.textContent = score;

startRestart.onclick = () => {
  if (game.getStatus() === 'idle') {
    startRestart.classList.remove('start');
    startRestart.classList.add('restart');

    startRestart.textContent = 'Restart';

    message[2].classList.toggle('hidden');

    game.start();
  }

  if (game.getStatus() === 'playing') {
    game.restart();
  }

  if (game.getStatus() === 'lose' || game.getStatus() === 'win') {
    const messageIndex = game.getStatus() === 'lose' ? 0 : 1;

    game.restart();
    message[messageIndex].classList.toggle('hidden');
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

  if (game.getStatus() === 'lose' || game.getStatus() === 'win') {
    const messageIndex = game.getStatus() === 'lose' ? 0 : 1;

    message[messageIndex].classList.toggle('hidden');
    removeEventListener('keydown', keydownHandler);
  }
};

addEventListener('keydown', keydownHandler);

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

  if (game.getStatus() === 'lose' || game.getStatus() === 'win') {
    const messageIndex = game.getStatus() === 'lose' ? 0 : 1;

    message[messageIndex].classList.toggle('hidden');
    removeEventListener('touchstart', touchStartHandler);
    removeEventListener('touchend', touchEndHandler);
  }
};

addEventListener('touchstart', touchStartHandler);
addEventListener('touchend', touchEndHandler);
