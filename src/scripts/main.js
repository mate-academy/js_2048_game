'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startMessage.classList.add('hidden');
    render();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    render();
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    render();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
    render();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
    render();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
    render();
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  } else if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  }
});

let startX = 0;
let startY = 0;

const gameField = document.querySelector('.game-field');

gameField.addEventListener('touchstart', (touchEvent) => {
  startX = touchEvent.touches[0].clientX;
  startY = touchEvent.touches[0].clientY;
});

gameField.addEventListener('touchend', (touchEvent) => {
  const endX = touchEvent.changedTouches[0].clientX;
  const endY = touchEvent.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;

  const minSwipeDistance = 30;

  if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else {
    if (dy > 0) {
      game.moveDown();
    } else {
      game.moveUp();
    }
  }

  render();

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  } else if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  }
});

function render() {
  const state = game.getState();

  for (let row = 0; row < state.length; row++) {
    for (let column = 0; column < state[row].length; column++) {
      const cellIndex = row * 4 + column;

      const classes = cells[cellIndex].className.split(' ');

      const tileClass = classes.find((className) => {
        return className.startsWith('field-cell--');
      });

      if (tileClass) {
        cells[cellIndex].classList.remove(tileClass);
      }

      if (state[row][column] === 0) {
        cells[cellIndex].textContent = '';
      } else {
        cells[cellIndex].textContent = state[row][column];
        cells[cellIndex].classList.add(`field-cell--${state[row][column]}`);
      }
    }
  }
  score.textContent = game.getScore();
}
