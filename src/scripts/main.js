'use strict';
// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('.start');
const winMassage = document.querySelector('.message-win');
const loseMassage = document.querySelector('.message-lose');
const startMassage = document.querySelector('.message-start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
let restart = false;

function render(board) {
  let index = 0;

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const cell = cells[index];
      const value = board[y][x];

      cell.className = 'field-cell';

      if (value === 0) {
        cell.textContent = '';
      } else {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
      index++;
    }
  }
}

startButton.addEventListener('click', () => {
  game.start();
  startMassage.classList.add('hidden');
  render(game.board);

  if (!restart) {
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    startButton.style.fontSize = '16px';
    restart = true;
  } else {
    startButton.textContent = 'Start';
    startButton.style.backgroundColor = '#1dae28';
    startButton.style.fontSize = '20px';
    game.score = 0;
    restart = false;
  }
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
  }

  if (moved) {
    game.spawnCell();
    scoreElement.textContent = game.score;
    render(game.board);

    if (game.checkWin()) {
      winMassage.classList.remove('hidden');
    } else if (game.checkLose()) {
      loseMassage.classList.remove('hidden');
    }
  }
});
