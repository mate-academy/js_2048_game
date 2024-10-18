'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
document.addEventListener('DOMContentLoaded', () => {
  const scoreResult = document.querySelector('.game-score');
  const startButton = document.querySelector('.start');
  const gameRows = document.querySelectorAll('.field-row');



  function removeModificators(item) {
    const classes = item.className.split(' ');

    classes.forEach((className) => {
      if (/^field-cell--\d+$/.test(className)) {
        item.classList.remove(className);
      }
    });
  }

  function checkResult(result) {
    if (result === 'win' || result === 'lose') {
      const message = document.querySelector(`.message-${result}`);

      message.classList.remove('hidden');
    }
  }

  function replaceItems() {
    const state = game.getState();

    for (let indexRow = 0; indexRow < state.length; indexRow++) {
      const row = gameRows[indexRow].querySelectorAll('.field-cell');

      for (let indexCail = 0; indexCail < row.length; indexCail++) {
        const cailNumber = state[indexRow][indexCail];

        removeModificators(row[indexCail]);

        if (cailNumber !== 0) {
          row[indexCail].classList.add(`field-cell--${cailNumber}`);
          row[indexCail].innerText = cailNumber;
        } else {
          row[indexCail].innerText = '';
        }
      }
    }
  }

  startButton.addEventListener('click', () => {
    const messageStart = document.querySelector('.message-start');

    game.start();
    messageStart.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.innerText = 'Restart';
    if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
      game.restart();
      location.reload();
    }
    replaceItems();
  });

  document.addEventListener('keydown', (e) => {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }
    replaceItems();
    scoreResult.innerText = game.getScore();

    checkResult(game.getStatus());
  });
});
