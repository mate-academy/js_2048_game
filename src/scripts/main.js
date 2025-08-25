'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

const Game = require('../modules/Game.class');

const game = new Game();
const boardEl = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const messageEl = document.querySelector('.message');
const messageStart = document.querySelector('.message-start');
const startBtn = document.querySelector('.button.start');

function render() {
  boardEl.innerHTML = '';

  const state = game.getState();

  state.forEach((row) => {
    row.forEach((cell) => {
      const div = document.createElement('div');

      div.classList.add('field-cell');

      if (cell !== 0) {
        div.textContent = cell;
        div.classList.add(`field-cell--${cell}`);
      }
      boardEl.appendChild(div);
    });
  });
  scoreEl.textContent = game.getScore();

  if (game.getStatus() === 'won') {
    messageEl.textContent = 'You win!';
    messageEl.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageEl.textContent = 'You lose! Restart the game?';
    messageEl.classList.remove('hidden');
  } else {
    messageEl.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();

    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    }

    if (e.key === 'ArrowRight') {
      game.moveRight();
    }

    if (e.key === 'ArrowUp') {
      game.moveUp();
    }

    if (e.key === 'ArrowDown') {
      game.moveDown();
    }

    render();
  }
});

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
    startBtn.classList.remove('start');
  } else {
    game.restart();
  }
  messageStart.classList.add('hidden');
  render();
});
