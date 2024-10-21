'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if(game.getStatus() === 'playing'){
    game.restart();
    startButton.textContent = 'start';
  } else if(game.getStatus() === 'idle'){
    game.start();
    startButton.textContent = 'restart';
  }
  updateUI();
});

function updateUI() {
  const cells = document.querySelectorAll('.field-cell');
  const board = game.getState();

  for(let row = 0; row < board.length; row++){
    for(let col = 0; col < board[row].length; col++){
      const cell = cells[row * game.size + col];
      cell.textContent = board[row][col] || '';
      cell.className = `field-cell field-cell--${board[row][col] || 'empty'}`;
    }
  }
  score.textContent = game.getScore();

    if (game.isWin()) {
      alert('WIN!');
      game.restart();
      updateUI();
    } else if (game.isLose()) {
      alert('LOSE!');
      game.restart();
      updateUI();
    }
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowLeft'){
    game.moveLeft();
  }
  if(e.key === 'ArrowRight'){
    game.moveRight();
  }
  if(e.key === 'ArrowUp'){
    game.moveUp();
  }
  if(e.key === 'ArrowDown'){
    game.moveDown();
  }

  updateUI();
});
