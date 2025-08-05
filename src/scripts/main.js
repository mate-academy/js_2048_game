'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startBtn = document.querySelector('.button--start');

function render() {
  const cells = document.querySelectorAll('.field-cell');

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      const value = game.board[row][col];
      const cell = cells[index];

      // Ставимо текст
      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      // Додаємо клас-модифікатор з числом
      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function lose() {
  if (game.checklose()) {
    const loseMsg = document.querySelector('.message-lose');

    loseMsg.classList.remove('hidden');
  }
}

function win() {
  if (game.checkWin()) {
    const winMsg = document.querySelector('.message-win');

    winMsg.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('restart')) {
    game.restart();
  } else {
    game.start();
  }
  render();
  game.updateScore();
});

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'ArrowLeft') {
    game.moveLeft();
    render();
    game.updateScore();
    lose();
    win();
  }

  if (ev.key === 'ArrowRight') {
    game.moveRight();
    render();
    game.updateScore();
    lose();
    win();
  }

  if (ev.key === 'ArrowUp') {
    game.moveUp();
    render();
    game.updateScore();
    lose();
    win();
  }

  if (ev.key === 'ArrowDown') {
    game.moveDown();
    render();
    game.updateScore();
    lose();
    win();
  }
});
