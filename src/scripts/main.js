'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('button');

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    game.start();
    render();

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    game.start();
    render();
  }
});

document.addEventListener('keydown', (e) => {
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

function render() {
  const state = game.getState();

  const cells = document.querySelectorAll('.field-cell');

  for (let i = 0; i < cells.length; i++) {
    const value = (cells[i].textContent = state[Math.floor(i / 4)][i % 4]);

    cells[i].className = 'field-cell';
    cells[i].textContent = value;
    cells[i].textContent = value === 0 ? ' ' : value;
    cells[i].classList.add(`field-cell--${value}`);
  }

  const score = document.querySelector('.game-score');

  score.textContent = game.getScore();

  const gameStatus = game.getStatus();
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');

  if (gameStatus === 'playing') {
    messageStart.classList.add('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (gameStatus === 'playing') {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}
render();
