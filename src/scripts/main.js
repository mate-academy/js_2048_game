'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('button');
const field = document.querySelector('.game-field');

const fieldRows = field.rows;
const fieldCells = [...fieldRows].map((row) => row.cells);

function emptyField() {
  for (const row of fieldCells) {
    [...row].forEach((cell) => {
      if (cell.classList.length === 2) {
        cell.classList.remove(cell.classList[1]);
        cell.textContent = '';
      }
    });
  }
}

function updateCell(arr, add) {
  const cell = fieldCells[arr[0]][arr[1]];
  const classes = cell.classList;

  if (add) {
    if (classes[1]) {
      cell.classList.remove(classes[1]);
    }

    cell.classList.add(`field-cell--${arr[2]}`);
    cell.textContent = `${arr[2]}`;
  } else {
    cell.classList.remove(classes[1]);
    cell.textContent = '';
  }
}

function move(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      updateCell([x, y, grid[x][y]], grid[x][y] !== 0);
    }
  }
}

button.addEventListener('click', (e) => {
  if ([...e.target.classList].includes('start')) {
    game.start();
    updateCell(game.getRandomCell(), true);
    updateCell(game.getRandomCell(), true);

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    emptyField();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      game.moveLeft();
      move(game.grid);
      break;
    case 'ArrowRight':
      game.moveRight();
      move(game.grid);
      break;
    case 'ArrowUp':
      game.moveUp();
      move(game.grid);
      break;
    case 'ArrowDown':
      game.moveDown();
      move(game.grid);
      break;
  }
});

let startX;
let startY;

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
});

document.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].pageX;
  const endY = e.changedTouches[0].pageY;
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if(Math.abs(deltaX) > Math.abs(deltaY)) {
    if(deltaX > 0) {
      game.moveRight();
      move(game.grid);
    } else {
      game.moveLeft();
      move(game.grid);
    }
  } else {
    if(deltaY > 0) {
      game.moveDown();
      move(game.grid);
    } else {
      game.moveUp();
      move(game.grid);
    }
  }
});
