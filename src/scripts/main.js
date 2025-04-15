'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      updateGameField(game.getState());
      updateScore(game.getScore());
      break;
    case 'ArrowDown':
      game.moveDown();
      updateGameField(game.getState());
      updateScore(game.getScore());
      break;
    case 'ArrowRight':
      game.moveRight();
      updateGameField(game.getState());
      updateScore(game.getScore());
      break;
    case 'ArrowLeft':
      game.moveLeft();
      updateGameField(game.getState());
      updateScore(game.getScore());
      break;
  }
});

startButton.addEventListener('click', () => {
  game.start();
  updateGameField(game.getState());
});

restartButton.addEventListener('click', () => {
  game.restart();
  updateGameField(game.getState());
});

function updateGameField(board) {
  const gameField = document.querySelector('.game-field');
  const rows = gameField.querySelectorAll('.field-row');

  for (let row = 0; row < board.length; row++) {
    const cells = rows[row].querySelectorAll('.field-cell');

    for (let col = 0; col < board[row].length; col++) {
      const value = board[row][col];

      cells[col].textContent = value === 0 ? '' : value;
    }
  }
}

function updateScore(score) {
  const scoreElement = document.getElementById('game-score');

  scoreElement.textContent = score;
}
