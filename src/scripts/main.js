'use strict';

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.button.start');

document.addEventListener('keydown', () => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moveMade = false;

  switch (event.key) {
    case ARROW_LEFT:
      game.moveLeft();
      moveMade = true;
      break;

    case ARROW_RIGHT:
      game.moveRight();
      moveMade = true;
      break;

    case ARROW_UP:
      game.moveUp();
      moveMade = true;
      break;

    case ARROW_DOWN:
      game.moveDown();
      moveMade = true;
      break;
  }


  if (moveMade) {
    update();

    if (game.getStatus() === 'win') {
      showWin();
    } else if (game.getStatus() === 'lose') {
      showLose();
    }
  }
});

function update() {
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');
  let cellIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = board[row][col];
      const cell = cells[cellIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = `field-cell field-cell--${value}`;

      cellIndex++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();
}

function showWin() {
  document.querySelector('.message-win').classList.remove('hidden');
}

function showLose() {
  document.querySelector('.message-lose').classList.remove('hidden');
}

function hideMessages() {
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-start').classList.add('hidden');
}

startBtn.addEventListener('click', () => {
  startBtn.textContent = 'Restart';

  if (
    game.getStatus() === 'win' ||
    game.getStatus() === 'idle' ||
    game.getStatus() === 'lose' ||
    game.getStatus() === 'playing'
  ) {
    game.restart();
    update();
    hideMessages();
    startBtn.textContent = 'Restart';
  }
});
