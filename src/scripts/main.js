'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgLose = document.querySelector('.message-lose');
const msgWin = document.querySelector('.message-win');
const gameRows = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');
// Write your code here

button.addEventListener('click', (e) => {
  if (button.classList.contains('restart')) {
    game.restart();
    game.start();
  } else {
    game.start();
  }

  button.classList.remove('start');
  button.classList.add('restart');
  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  button.textContent = 'Restart';

  updateStat(game.getState());
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateStat(game.state);
  score.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    msgWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    msgLose.classList.remove('hidden');
  }
});

function updateStat(state) {
  for (let i = 0; i < 4; i++) {
    const cells = gameRows[i].querySelectorAll('.field-cell');

    for (let k = 0; k < 4; k++) {
      const value = state[i][k];

      cells[k].className = 'field-cell';

      if (value === 0) {
        cells[k].textContent = '';
      } else {
        cells[k].textContent = value;
        cells[k].classList.add('field-cell--' + value);
      }
    }
  }
}
