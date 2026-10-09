'use strict';
/* global Game */

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  cells.forEach((cell, index) => {
    const value = game.state[Math.floor(index / 4)][index % 4];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.score;

  startMessage.classList.toggle('hidden', game.status !== 'idle');
  winMessage.classList.toggle('hidden', game.status !== 'win');
  loseMessage.classList.toggle('hidden', game.status !== 'lose');

  startButton.textContent = game.status === 'idle' ? 'Start' : 'Restart';
  startButton.classList.toggle('restart', game.status !== 'idle');
}

function handleMove(direction) {
  if (game.status !== 'playing') {
    return;
  }

  switch (direction) {
    case 'left':
      game.moveLeft();
      break;
    case 'right':
      game.moveRight();
      break;
    case 'up':
      game.moveUp();
      break;
    case 'down':
      game.moveDown();
      break;
    default:
      return;
  }

  render();
}

startButton.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  const moves = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  const direction = moves[keyboardEvent.key];

  if (direction) {
    keyboardEvent.preventDefault();
    handleMove(direction);
  }
});

render();
