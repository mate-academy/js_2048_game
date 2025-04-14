'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const startBtn = document.querySelector('.button.start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');

function render() {
  const state = game.getState();
  const gameStatus = game.getStatus();
  let i = 0;

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      const cell = cells[i];
      cell.className = 'field-cell';

      if (state[row][column]) {
        cell.textContent = state[row][column];
        cell.classList.add(`field-cell--${state[row][column]}`);
      } else {
        cell.textContent = '';
      }

      i++;
    }
  }

  gameScore.textContent = game.getScore();

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (startBtn.className === 'button restart') {
    game.restart();
  }

  game.start();
  render();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  startBtn.textContent = 'Restart';
  startBtn.className = 'button restart';
});

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

    render();
  }
});
