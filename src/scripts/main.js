/* eslint-disable no-shadow */
/* eslint-disable no-console */
'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    game.restart();
  } else {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }

  render();
});

document.querySelector('.game-score').textContent = game.getScore();

document.querySelector('.message-start').classList.add('hidden');

if (game.getStatus() === 'win') {
  document.querySelector('.message-win').classList.remove('hidden');
}

if (game.getStatus() === 'lose') {
  document.querySelector('.message-lose').classList.remove('hidden');
}

document.addEventListener('keydown', (event) => {
  const prevState = JSON.parse(JSON.stringify(game.getState()));
  let moved = false;

  if (event.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (event.key === 'ArrowRight') {
    game.moveRight();
  }

  if (event.key === 'ArrowUp') {
    game.moveUp();
  }

  if (event.key === 'ArrowDown') {
    game.moveDown();
  }

  moved = game.hasMoved(prevState);

  if (!game.checkWin()) {
    game.checkLose();
  }

  if (moved) {
    game.addRandomTile();

    if (!game.checkWin()) {
      game.checkLose();
    }
    render();
  }
});

function render() {
  const state = game.getState();
  const scoreEl = document.querySelector('.game-score');

  scoreEl.textContent = game.getScore();

  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      const cell = cells[i * 4 + j];

      cell.textContent = state[i][j] === 0 ? '' : state[i][j];

      cell.className =
        cell.textContent === ''
          ? 'field-cell'
          : 'field-cell field-cell--' + state[i][j];
    }
  }

  // Скрываем/показываем сообщения
  document.querySelector('.message-start').classList.add('hidden');

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else {
    document.querySelector('.message-win').classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  } else {
    document.querySelector('.message-lose').classList.add('hidden');
  }
}
