'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
// const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const messages = [...document.querySelectorAll('.message')];
const gameScore = document.querySelector('.game-score');

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
    return;
  }

  const key = e.key;

  switch (key) {
    case 'ArrowLeft':
      game.moveLeft();
      updateMessage();
      break;
    case 'ArrowRight':
      game.moveRight();
      updateMessage();
      break;
    case 'ArrowUp':
      game.moveUp();
      updateMessage();
      break;
    case 'ArrowDown':
      game.moveDown();
      updateMessage();
      break;
  }
  game.getState();
  gameScore.textContent = game.getScore();
});

function updateMessage() {
  if (!messages.length) {
    return;
  }

  if (game.getStatus() === 'playing') {
    messages.forEach((message) => message.classList.add('hidden'));
  }

  if (game.getStatus() === 'win') {
    winMessage?.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage?.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (!game.isGameStarted) {
    game.start();
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
    updateMessage();
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');

    updateMessage();
    document.querySelector('.message-start').classList.remove('hidden');
  }
  gameScore.textContent = game.getScore();
});
