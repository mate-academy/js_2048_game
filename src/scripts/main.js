'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');
const gameRows = document.querySelectorAll('.field-row');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

button.addEventListener('click', (e) => {
  if (button.classList.contains('restart')) {
    game.restart();

    updateStat(game.getState());

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');

    score.textContent = '0';

    return;
  }

  game.start();
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

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
