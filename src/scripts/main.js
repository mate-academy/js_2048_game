'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');

document.getElementById('start-button').onclick = () => {
  game.start();
  updateTable(game.getState());

  if (game.getStatus() === 'playing') {
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('restart-button').classList.remove('hidden');
    document.querySelector('.message-start').classList.add('hidden');
  }
};

document.getElementById('restart-button').onclick = () => {
  game.restart();
  updateTable(game.getState());
  score.innerText = game.getScore();
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
};

const table = document.querySelector('.game-field');

function updateTable(state) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (state[i][j] === 0) {
        table.rows[i].cells[j].className = 'field-cell';
        table.rows[i].cells[j].innerText = '';
      } else {
        table.rows[i].cells[j].className =
          `field-cell field-cell--${state[i][j]}`;
        table.rows[i].cells[j].innerText = state[i][j];
      }
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
    if (game.getState() === 'win') {
    }
  } else if (game.getStatus() === 'playing') {
    if (e.key === 'a' || e.key === 'ArrowLeft') {
      game.moveLeft();
    }

    if (e.key === 'd' || e.key === 'ArrowRight') {
      game.moveRight();
    }

    if (e.key === 'w' || e.key === 'ArrowUp') {
      game.moveUp();
    }

    if (e.key === 's' || e.key === 'ArrowDown') {
      game.moveDown();
    }
    updateTable(game.getState());
    score.innerText = game.getScore();

    if (game.getStatus() === 'win') {
      document.querySelector('.message-win').classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }
});
