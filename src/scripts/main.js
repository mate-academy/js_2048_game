'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const scoreEl = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start, .button.restart');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = Array.from(document.querySelectorAll('.field-cell'));

let previousState = game.getState();

function animateCell(cell, animationClass) {
  cell.classList.add(animationClass);

  const onAnimationEnd = () => {
    cell.classList.remove(animationClass);
    cell.removeEventListener('animationend', onAnimationEnd);
  };

  cell.addEventListener('animationend', onAnimationEnd);
}

function render() {
  const state = game.getState();

  scoreEl.textContent = game.getScore();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];
    const prevValue = previousState[row][col];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);

      if (prevValue === 0) {
        animateCell(cell, 'tile-new');
      } else if (value > prevValue) {
        animateCell(cell, 'tile-merged');
      }
    }
  });

  previousState = state;

  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

function handleAction(action) {
  if (action === 'start') {
    game.start();
  }

  if (action === 'restart') {
    game.restart();
  }

  if (action === 'moveLeft') {
    game.moveLeft();
  }

  if (action === 'moveRight') {
    game.moveRight();
  }

  if (action === 'moveUp') {
    game.moveUp();
  }

  if (action === 'moveDown') {
    game.moveDown();
  }

  render();
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    handleAction('start');
  } else {
    handleAction('restart');
  }
});

document.addEventListener('keydown', (evt) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (evt.key) {
    case 'ArrowLeft':
    case 'a':
      evt.preventDefault();
      handleAction('moveLeft');
      break;
    case 'ArrowRight':
    case 'd':
      evt.preventDefault();
      handleAction('moveRight');
      break;
    case 'ArrowUp':
    case 'w':
      evt.preventDefault();
      handleAction('moveUp');
      break;
    case 'ArrowDown':
    case 's':
      evt.preventDefault();
      handleAction('moveDown');
      break;
    default:
      break;
  }
});

render();
