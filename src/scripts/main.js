'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

startButton.addEventListener('click', (e) => {
  game.start();
  updateBoard();

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startMessage.classList.add('hidden');

  if (!loseMessage.classList.contains('hidden')) {
    loseMessage.classList.add('hidden');
  }

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }
});

function updateBoard() {
  const gameState = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = gameState[row][col];

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });

  document.querySelector('.game-score').textContent = game.getScore();
}

document.addEventListener('keydown', (e) => {
  if (game.status === 'playing') {
    const oldField = JSON.stringify(game.getState());

    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        updateBoard();
        break;
      case 'ArrowRight':
        game.moveRight();
        updateBoard();
        break;
      case 'ArrowUp':
        game.moveUp();
        updateBoard();
        break;
      case 'ArrowDown':
        game.moveDown();
        updateBoard();
        break;
    }

    const newField = JSON.stringify(game.getState());

    if (oldField !== newField) {
      game.addRandomTile();
      updateBoard();

      const has2048 = game.getState().some((row) => row.includes(2048));

      if (has2048) {
        winMessage.classList.remove('hidden');
        game.status = 'win';

        return;
      }

      if (game.checkGameOver()) {
        loseMessage.classList.remove('hidden');
        game.status = 'lose';
      }
    }
  }
});
