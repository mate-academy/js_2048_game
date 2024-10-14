'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('button');
const field = document.querySelector('.game-field');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

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
      score.textContent = game.score;
      checkStatus();
    }
  }
}

function checkStatus() {
  if (game.status === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

button.addEventListener('click', (e) => {
  if ([...e.target.classList].includes('start')) {
    game.start();
    move(game.state);

    messageStart.classList.add('hidden');

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    score.textContent = 0;
    emptyField();

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.remove('hidden');

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }
});

document.addEventListener('keydown', (e) => {
  if (game.status === 'playing') {
    switch (e.code) {
      case 'ArrowLeft':
        game.moveLeft();
        move(game.state);
        break;
      case 'ArrowRight':
        game.moveRight();
        move(game.state);
        break;
      case 'ArrowUp':
        game.moveUp();
        move(game.state);
        break;
      case 'ArrowDown':
        game.moveDown();
        move(game.state);
        break;
    }
  }
});

field.addEventListener('touchstart', handleTouchStart, { passive: true });
field.addEventListener('touchmove', handleTouchMove, { passive: true });
field.addEventListener('touchend', handleTouchEnd, { passive: true });

let touchStartX, touchStartY, swipeDirection;

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;

  const swipeX = currentX - touchStartX;
  const swipeY = currentY - touchStartY;

  if (Math.abs(swipeX) > Math.abs(swipeY)) {
    swipeDirection = swipeX > 0 ? 'right' : 'left';
  } else {
    swipeDirection = swipeY > 0 ? 'down' : 'up';
  }
}

function handleTouchEnd(e) {
  if (game.status === 'playing') {
    switch (swipeDirection) {
      case 'left':
        game.moveLeft();
        move(game.state);
        break;
      case 'right':
        game.moveRight();
        move(game.state);
        break;
      case 'up':
        game.moveUp();
        move(game.state);
        break;
      case 'down':
        game.moveDown();
        move(game.state);
        break;
    }
  }
}
