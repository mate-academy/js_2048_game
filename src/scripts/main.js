'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();
const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const flatState = state.flat();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const value = flatState[index];

    [...cell.classList].forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    if (value === 0) {
      cell.textContent = '';
    } else {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  score.textContent = game.getScore();

  if (gameStatus === 'idle') {
    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  if (gameStatus === 'playing') {
    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  if (gameStatus === 'win') {
    startMessage.classList.add('hidden');
    winMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (keyEvent) => {
  const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (allowedKeys.includes(keyEvent.key)) {
    keyEvent.preventDefault();
  } else {
    return;
  }

  if (keyEvent.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (keyEvent.key === 'ArrowRight') {
    game.moveRight();
  }

  if (keyEvent.key === 'ArrowUp') {
    game.moveUp();
  }

  if (keyEvent.key === 'ArrowDown') {
    game.moveDown();
  }

  render();
});
