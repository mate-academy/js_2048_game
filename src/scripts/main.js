'use strict';

const Game = require('../modules/Game.class');
const startButton = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const gameOverText = document.querySelector('.game-over-text');
const game = new Game();

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
    }
    updateUI();
  }
});

function updateUI() {
  let index = 0;
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cells[index];

      cell.className = 'field-cell';

      if (state[row][col]) {
        cell.textContent = state[row][col];
        cell.classList.add(`field-cell--${state[row][col]}`);
      } else {
        cell.textContent = '';
      }
      index++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  const statusGame = game.getStatus();

  if (statusGame === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (statusGame === 'lose') {
    showGameOverMessage();
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (startButton.className === 'button restart') {
    game.restart();
    document.querySelector('.message-lose').classList.add('hidden');
  }

  game.start();
  updateUI();
  document.querySelector('.message-start').classList.add('hidden');
  startButton.textContent = 'Restart';
  startButton.className = 'button restart';
});

function showGameOverMessage() {
  gameOverText.style.backgroundColor = 'rgba(112, 104, 95, 0.5)';
  gameOverText.textContent = 'Game Over';

  function handleClick() {
    gameOverText.style.backgroundColor = '';
    gameOverText.textContent = '';
    document.removeEventListener('click', handleClick);
  }
  document.addEventListener('click', handleClick);
}
