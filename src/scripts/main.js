'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// Write your code here
const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const score = document.querySelector('.game-score');
const win = document.querySelector('.message-win');
const lose = document.querySelector('.message-lose');

function updateUI() {
  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = game.board[row][col];

    cells[i].textContent = value === 0 ? '' : value;
    cells[i].className = `field-cell field-cell--${value}`;
  }
}

button.addEventListener('click', () => {
  startMessage.classList.add('hidden');
  lose.classList.add('hidden');

  if (button.classList.contains('start') === true) {
    game.start();
    updateUI();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Reset';
  } else {
    game.restart();
    updateUI();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    startMessage.classList.remove('hidden');
  }

  score.textContent = game.getScore() || 0;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    updateUI();
    score.textContent = game.getScore();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
    updateUI();
    score.textContent = game.getScore();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
    updateUI();
    score.textContent = game.getScore();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
    updateUI();
    score.textContent = game.getScore();
  }

  if (game.hasWon()) {
    win.classList.remove('hidden');
  }

  if (!game.canMove()) {
    lose.classList.remove('hidden');
  }
});
