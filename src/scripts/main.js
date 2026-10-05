'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const buttonStart = document.querySelector('.button.start');

function play() {
  const state = game.getState();

  for (let row = 0; row < state.length; row++) {
    for (let column = 0; column < state[row].length; column++) {
      const cellIndex = row * state[row].length + column;

      cells[cellIndex].textContent = state[row][column] || '';

      const cell = cells[cellIndex];
      const value = state[row][column];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
  scoreElement.textContent = game.getScore();

  if (game.checkForWin() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.checkForLose() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    play();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
    play();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
    play();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
    play();
  }
});

let isStarted = false;

buttonStart.addEventListener('click', () => {
  if (!isStarted) {
    game.start();
    startMessage.classList.add('hidden');
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';
    isStarted = true;
  } else {
    game.restart();
    loseMessage.classList.add('hidden');
    play();
    buttonStart.classList.remove('restart');
    startMessage.classList.remove('hidden');
    buttonStart.classList.add('start');
    buttonStart.textContent = 'Start';
    isStarted = false;
  }

  play();
});
