'use strict';

// Uncomment the next lines to use your game instance in the browser
'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  scoreElement.textContent = game.getScore();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });

  const GameStatus = game.getStatus();

  // сначала скрываем все
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  // показываем нужное состояние
  if (GameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (GameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (GameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();

    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }

  render();
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;

    case 'ArrowRight':
      moved = game.moveRight();
      break;

    case 'ArrowUp':
      moved = game.moveUp();
      break;

    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    render();
  }
});

// first render
render();
