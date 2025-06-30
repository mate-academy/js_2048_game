'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

function renderBoard() {
  const cells = Array.from(document.querySelectorAll('.field-cell'));

  for (let i = 0; i < game.board.length; i++) {
    let value = 0;

    for (let y = 0; y < game.board[i].length; y++) {
      value = game.board[i][y];

      const index = i * 4 + y;

      cells[index].textContent = value === 0 || isNaN(value) ? '' : value;
      cells[index].className = 'field-cell';

      if (value !== 0) {
        cells[index].classList.add(`field-cell--${value}`);
      }
    }
  }
}

const buttonStart = document.querySelector('.button.start');

buttonStart.addEventListener('click', () => {
  game.start();
  renderBoard();
  document.querySelector('.message-start').classList.add('hidden');
});

function areBoardsEqual(board1, board2) {
  for (let i = 0; i < board1.length; i++) {
    for (let j = 0; j < board1[i].length; j++) {
      if (board1[i][j] !== board2[i][j]) {
        return false;
      }
    }
  }

  return true;
}

function actionsAfterPressing(action) {
  const clonedBoard = game.board.map((row) => [...row]);

  action();

  if (!areBoardsEqual(game.board, clonedBoard)) {
    countMoves++;
    game.addRandomTile();
    renderBoard();

    if (game.getStatus() === 'win') {
      document.querySelector('.message-win').classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      document.querySelector('.message-lose').classList.remove('hidden');
    }

    document.querySelector('.game-score').textContent = game.getScore();
  }

  if (countMoves >= 1) {
    buttonStart.classList.remove('start');
    buttonStart.textContent = 'Restart';
    buttonStart.classList.add('restart');
  }
}

let countMoves = 0;

document.addEventListener('keydown', (e) => {
  console.log(e.key);

  if (game.getStatus() !== 'win' && game.getStatus() !== 'lose') {
    if (e.key === 'ArrowUp') {
      actionsAfterPressing(() => game.moveUp());
    }

    if (e.key === 'ArrowDown') {
      actionsAfterPressing(() => game.moveDown());
    }

    if (e.key === 'ArrowLeft') {
      actionsAfterPressing(() => game.moveLeft());
    }

    if (e.key === 'ArrowRight') {
      actionsAfterPressing(() => game.moveRight());
    }
  }
});

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.textContent === 'Restart') {
    game.restart();
  }

  if (button.textContent === 'Start') {
    game.start();
  }

  document.querySelector('.game-score').textContent = game.getScore();

  countMoves = 0;
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  renderBoard();
});
