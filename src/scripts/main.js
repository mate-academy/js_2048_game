'use strict';

// Module
const Game = require('../modules/Game.class');
const game = new Game();

// All html veriables
const buttonStart = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const fieldRow = [...document.querySelectorAll('.field-row')];
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

function loseOrWin(statusToCheck) {
  if (statusToCheck === Game.STATUS.lose) {
    loseMessage.classList.remove('hidden');
  }

  if (statusToCheck === Game.STATUS.win) {
    winMessage.classList.remove('hidden');
  }
}

function displayNumbers(state) {
  for (let i = 0; i < fieldRow.length; i++) {
    for (let j = 0; j < fieldRow[i].children.length; j++) {
      fieldRow[i].children[j].textContent = '';
      fieldRow[i].children[j].className = `field-cell`;

      if (state[i][j] > 0) {
        fieldRow[i].children[j].textContent = state[i][j];

        fieldRow[i].children[j].className =
          `field-cell field-cell--${state[i][j]}`;
      }
    }
  }
}

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    buttonStart.textContent = 'Restart';

    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');

    game.start();
    displayNumbers(game.getState());

    gameScore.textContent = game.getScore();

    startMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  } else {
    buttonStart.textContent = 'Start';

    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');

    game.restart();
    displayNumbers(game.getState());

    gameScore.textContent = game.getScore();

    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
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
  displayNumbers(game.getState());
  gameScore.textContent = game.getScore();
  loseOrWin(game.getStatus());
});
