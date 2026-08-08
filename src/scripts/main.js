'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const buttonStart = document.querySelector('.button');
const messageWon = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('restart')) {
    buttonStart.textContent = 'Start';
    buttonStart.classList.add('start');
    buttonStart.classList.remove('restart');
    messageWon.classList.add('hidden');
    messageLose.classList.add('hidden');
    game.restart();
  } else {
    if (game.getStatus() === 'idle') {
      game.start();
      messageStart.classList.add('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    return;
  }

  e.preventDefault();

  const oldField = JSON.stringify(game.getState());

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  const newField = JSON.stringify(game.getState());

  if (oldField !== newField) {
    game.updateBoard();

    if (game.isGameWon()) {
      messageWon.classList.remove('hidden');
    }

    if (game.checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }

  if (!game.firstMove) {
    buttonStart.textContent = 'Restart';
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
  }
});
