/* eslint-disable no-useless-return */
'use strict';

import { GameField } from '../modules/Game.class';
import { gameStatus } from '../utils/const';

const gameField = document.querySelector('.game-field');
const button = document.querySelector('.button');
const game = new GameField(gameField);
const score = document.querySelector('.game-score');
const [lose, win, start] =
  document.querySelector('.message-container').children;

async function handleKeydown(e) {
  switch (e.key) {
    case 'ArrowUp':
      await game.moveUp();
      break;

    case 'ArrowDown':
      await game.moveDown();
      break;

    case 'ArrowLeft':
      await game.moveLeft();
      break;

    case 'ArrowRight':
      await game.moveRight();
      break;
  }

  score.textContent = game.getScore();

  if (game.getStatus() === gameStatus.lose) {
    window.removeEventListener('keydown', handleKeydown);
    lose.classList.remove('hidden');
  } else if (game.getStatus() === gameStatus.win) {
    window.removeEventListener('keydown', handleKeydown);
    win.classList.remove('hidden');
  }
}

button.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    start.classList.add('hidden');
    window.addEventListener('keydown', handleKeydown);
  } else if (e.target.classList.contains('restart')) {
    game.restart();
    button.classList.add('start');
    button.classList.remove('restart');
    button.textContent = 'Start';
    start.classList.remove('hidden');
    lose.classList.add('hidden');
    win.classList.add('hidden');
    score.textContent = game.getScore();
    window.removeEventListener('keydown', handleKeydown);
  }
});
