'use strict';

import Game from '../modules/Game.class';

const game = new Game();

// Write your code here
const startRestart = document.getElementsByClassName('button')[0];
const message = document.getElementsByClassName('message');

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
