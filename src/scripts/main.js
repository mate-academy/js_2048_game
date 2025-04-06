'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');

function startGame() {
  if (game.getStatus() === 'playing') {
    game.restart();
  } else {
    game.start();
  }

  const gameMessage = document.querySelector('.message-start');

  gameMessage.classList.add('hidden');

  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  startButton.textContent = 'Restart';
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  } else if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  scoreElement.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    const winMessage = document.querySelector('.message-win');

    winMessage.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    const loseMessage = document.querySelector('.message-lose');

    loseMessage.classList.remove('hidden');
  }
});
