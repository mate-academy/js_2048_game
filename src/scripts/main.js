/* eslint-disable padding-line-between-statements */
'use strict';

import Game from '../modules/Game.class';
const game = new Game();

const changeStartButton = (button) => {
  button.classList.remove('start');
  button.classList.add('restart');
  button.innerText = 'Restart';
};

const hideMessageContainer = () => {
  const messageContainer = document.querySelector('.message-start');
  messageContainer.classList.add('hidden');
};

const initializeGame = () => {
  const startButton = document.querySelector('.button');

  if (startButton) {
    startButton.addEventListener('click', () => {
      if (game.getStatus() === 'idle') {
        game.start();

        changeStartButton(startButton);
        hideMessageContainer();
      } else if (game.getStatus() === 'playing') {
        game.restart();
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', initializeGame);
// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
  }

  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
    game.isGameOver();
  }

  game.updateTheScore();
  game.updateTheBoard();
});
