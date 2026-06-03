'use strict';

import Game from '../modules/Game.class';

const game = new Game();

document.addEventListener('keydown', (e) => {
  if (game.isGameOver()) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  render();
});

const startButton = document.querySelector('.button');

startButton.addEventListener('click', (e) => {
  game.restart();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  const startMessage = document.querySelector('.message-start');
  
  if (startMessage) {
    startMessage.classList.add('hidden');
  }

  render();
});

function render() {
  const cells = document.querySelectorAll('.field-cell');
  const board = game.getState();

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const index = r * 4 + c;
      const cell = cells[index];

      cell.textContent = '';
      cell.className = 'field-cell';

      const loseMessage = document.querySelector('.message-lose');

      if (game.isGameOver()) {
        loseMessage.classList.remove('hidden');
      } else {
        loseMessage.classList.add('hidden');
      }

      if (board[r][c] > 0) {
        cell.textContent = board[r][c];
        cell.classList.add(`field-cell--${board[r][c]}`);
      }
    }
  }

  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = game.getScore();
}
