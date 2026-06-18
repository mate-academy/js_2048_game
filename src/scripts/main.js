'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const flatState = game.getState().flat();
  const gameStatus = game.getStatus();

  score.textContent = game.getScore();

  for (let i = 0; i < cells.length; i++) {
    cells[i].className = 'field-cell';

    if (flatState[i] === 0) {
      cells[i].textContent = '';
    } else {
      cells[i].textContent = flatState[i];
      cells[i].classList.add(`field-cell--${flatState[i]}`);
    }
  }

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else {
    winMessage.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  } else {
    loseMessage.classList.add('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }
  render();
  startMessage.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    render();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    render();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    render();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    render();
  }
});
