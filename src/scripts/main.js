'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const loseMesseg = document.querySelector('.message-lose');
const winMesseg = document.querySelector('.message-win');
const startMesseg = document.querySelector('.message-start');
const start = document.querySelector('.button.start');
const cellElement = document.querySelectorAll('.field-cell');

function startGame() {
  game.restart();
  game.score = 0;
  game.status = 'playing';
  render();
}

function render() {
  const grid = game.getState();

  const cells = cellElement;
  const score = document.querySelector('.game-score');

  score.textContent = game.getScore();

  let i = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const val = grid[r][c];
      const cell = cells[i++];

      cell.classList.forEach((element) => {
        if (element.startsWith('field-cell--')) {
          cell.classList.remove(element);
        }
      });
      cell.textContent = val || '';

      if (val > 0) {
        cell.classList.add(`field-cell--${val}`);
      }
    }
  }

  winMesseg.classList.toggle('hidden', game.status !== 'win');
  loseMesseg.classList.toggle('hidden', game.status !== 'lose');
  startMesseg.classList.toggle('hidden', game.status === 'playing' ||
    game.status === 'lose');
}

start.addEventListener('click', () => {
  startGame();
  start.textContent = 'Restart';
});

const moveMap = {
  left: () => game.moveLeft(),
  right: () => game.moveRight(),
  up: () => game.moveUp(),
  down: () => game.moveDown(),
};

const move = (direction) => {
  const action = moveMap[direction];

  if (action) {
    const moved = action();

    if (moved) {
      game.addRandomTile();
      game.checkWin();
      game.checkLose();
      render();
    }
  }
};

document.addEventListener('keydown', function (eventt) {
  switch (eventt.key) {
    case 'ArrowLeft':
    case 'a':
      move('left');
      break;
    case 'ArrowRight':
    case 'd':
      move('right');
      break;
    case 'ArrowUp':
    case 'w':
      move('up');
      break;
    case 'ArrowDown':
    case 's':
      move('down');
      break;
  }
});
