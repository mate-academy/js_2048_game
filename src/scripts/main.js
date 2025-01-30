'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// const gameField = document.querySelector('tbody');
const score = document.querySelector('.game-score');
const button = document.querySelector('button');
// const rows = gameField.querySelectorAll('tr');
// const cells = document.querySelectorAll('td');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function endGame() {
  this.status = 'lose';

  if (!game.checkEmptyTeil()) {
    messageLose.classList.remove('hidden');
  }

  if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.status === 'win') {
    messageWin.classList.remove('hidden');
  }

  document.removeEventListener('keydown', this.handleKeyDown);

  button.textContent = 'Restart';
  button.classList.add('restart');
  button.classList.remove('start');
}

function isWin() {
  return game.board.some((row) => row.includes(2048));
}

export function render(boardState) {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const value = boardState[Math.floor(index / 4)][index % 4];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });

  score.textContent = game.score;
}

document.addEventListener('keydown', (ev) => {
  ev.preventDefault();

  if (game.status === 'ended') {
    return;
  }

  game.status = 'playing';

  switch (ev.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  game.addRandomTile();
  render(game.board);

  if (isWin()) {
    messageWin.classList.remove('hidden');
    game.status = 'win';

    return;
  }

  if (!game.checkEmptyTeil()) {
    endGame();
  }
});

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    game.start();

    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
    messageStart.classList.add('hidden');
  } else {
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    game.restart();
  }

  render(game.board);
});
