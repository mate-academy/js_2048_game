'use strict';

// Uncomment the next lines to use your game instance in the browser
document.addEventListener('DOMContentLoaded', () => {
  const Game = require('../modules/Game.class');
  const game = new Game();

  const button = document.querySelector('.button');
  const gameScore = document.querySelector('.game-score');
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  button.addEventListener('click', () => {
    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
      game.start();
      renderBoard(game.getState());

      document.addEventListener('keydown', (e) => {
        const keyName = e.key;

        if (game.getStatus() === 'lose') {
          loseMessage.classList.remove('hidden');

          return;
        }

        if (game.getStatus() === 'win') {
          winMessage.classList.remove('hidden');

          return;
        }

        if (keyName === 'ArrowRight') {
          game.moveRight();
          renderBoard(game.getState());
        }

        if (keyName === 'ArrowLeft') {
          game.moveLeft();
          renderBoard(game.getState());
        }

        if (keyName === 'ArrowUp') {
          game.moveUp();
          renderBoard(game.getState());
        }

        if (keyName === 'ArrowDown') {
          game.moveDown();
          renderBoard(game.getState());
        }

        gameScore.textContent = game.getScore();

        if (game.getStatus() === 'win') {
          winMessage.classList.remove('hidden');
        } else if (game.getStatus() === 'lose') {
          loseMessage.classList.remove('hidden');
        }
      });

      if (button.classList.contains('restart') && startMessage) {
        startMessage.classList.add('hidden');
      }
    } else {
      button.classList.remove('restart');
      button.classList.add('start');
      button.textContent = 'Start';

      if (!winMessage.classList.contains('hidden')) {
        winMessage.classList.add('hidden');
      }

      if (!loseMessage.classList.contains('hidden')) {
        loseMessage.classList.add('hidden');
      }

      gameScore.textContent = game.getScore();
      game.restart();
      renderBoard(game.getState());

      if (button.classList.contains('start') && startMessage) {
        startMessage.classList.remove('hidden');
      }
    }
  });
});

function renderBoard(state) {
  const rows = document.querySelectorAll('.game-field tbody tr');

  for (let i = 0; i < 4; i++) {
    const cells = rows[i].querySelectorAll('td');

    for (let j = 0; j < 4; j++) {
      cells[j].textContent = state[i][j] === 0 ? '' : state[i][j];

      cells[j].classList.forEach((cl) => {
        if (cl.startsWith('field-cell--')) {
          cells[j].classList.remove(cl);
        }
      });

      if (state[i][j] !== 0) {
        cells[j].classList.add(`field-cell--${state[i][j]}`);
      }
    }
  }
}
