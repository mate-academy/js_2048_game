'use strict';

const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const gameButton = document.querySelector('.button');

gameButton.addEventListener('mousedown', () => {
  const messages = document.querySelectorAll('.message');

  messages.forEach((msg) => msg.classList.add('hidden'));

  if (gameButton.classList.contains('start')) {
    // start the game
    game.start();

    // initiate the game
    initiateCells(game.getState());
    updateScore();

    // change button text and class
    gameButton.classList.remove('start');
    gameButton.classList.add('restart');
    gameButton.textContent = 'Restart';
  } else {
    // change 'restart' button to 'start'
    game.restart();
    initiateCells(game.getState());
    updateScore();
    gameButton.classList.remove('restart');
    gameButton.classList.add('start');
    gameButton.textContent = 'Start';
  }
});

function initiateCells(initialState) {
  const gameField = document.querySelector('.game-field');
  const gameFieldBody = gameField.tBodies[0];

  for (let i = 0; i < initialState.length; i++) {
    for (let y = 0; y < initialState[i].length; y++) {
      const cell = initialState[i][y];

      if (cell === 0) {
        gameFieldBody.rows[i].cells[y].textContent = '';
      } else {
        gameFieldBody.rows[i].cells[y].textContent = cell;
      }
      updateCellClass(gameFieldBody.rows[i].cells[y], cell);
    }
  }
}

function updateCellClass(cellElement, value) {
  cellElement.classList.forEach((cls) => {
    if (cls.startsWith('field-cell--')) {
      cellElement.classList.remove(cls);
    }
  });

  if (value > 0) {
    cellElement.classList.add(`field-cell--${value}`);
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    if (e.code === 'ArrowLeft') {
      game.moveLeft();
      game.addRandomTile();

      updateScore();
      initiateCells(game.getState());
    }

    if (e.code === 'ArrowRight') {
      game.moveRight();
      game.addRandomTile();

      updateScore();
      initiateCells(game.getState());
    }

    if (e.code === 'ArrowUp') {
      game.moveUp();
      game.addRandomTile();

      updateScore();
      initiateCells(game.getState());
    }

    if (e.code === 'ArrowDown') {
      game.moveDown();
      game.addRandomTile();

      updateScore();
      initiateCells(game.getState());
    }
  } else if (game.getStatus() === 'win') {
    const winMessage = document.querySelector('.message-win');

    winMessage.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    const winMessage = document.querySelector('.message-lose');

    winMessage.classList.remove('hidden');
  }
});

function updateScore() {
  const score = document.querySelector('.game-score');

  score.textContent = game.getScore();
}
