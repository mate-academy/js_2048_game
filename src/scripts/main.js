'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const table = document.querySelector('table');
const tbody = table.tBodies[0];
const button = document.querySelector('button');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    game.restart();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    score.innerText = '0';

    updateTable();

    return;
  }

  game.start();

  startMessage.classList.add('hidden');

  updateTable();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (
    key === 'ArrowRight' ||
    key === 'ArrowLeft' ||
    key === 'ArrowUp' ||
    key === 'ArrowDown'
  ) {
    const state = game.getState();
    const gameStatus = game.getStatus();

    if (
      gameStatus === 'idle' ||
      gameStatus === 'lose' ||
      gameStatus === 'win'
    ) {
      return;
    }

    // after the first move I change the Start button to Restart button

    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }

    const currentStateString = JSON.stringify(state);

    switch (key) {
      case 'ArrowRight':
        game.moveRight();

        break;

      case 'ArrowLeft':
        game.moveLeft();

        break;

      case 'ArrowUp':
        game.moveUp();

        break;

      case 'ArrowDown':
        game.moveDown();

        break;

      default:
        break;
    }

    const nextStateString = JSON.stringify(state);

    // if state doesn't change after move, then do nothing

    if (currentStateString === nextStateString) {
      return;
    }

    // here I update the score in the table

    score.innerText = `${game.getScore()}`;

    // here I add 1 new digit to an empty cell and update the table

    game.addRandomDigitToEmptyCell(1);
    updateTable();

    // here I need to check if 2048 exist

    const isPlayerWin = game.checkIsPlayerWin();

    if (isPlayerWin) {
      game.status = 'win';
      winMessage.classList.remove('hidden');

      return;
    }

    // if there are no more available moves, a game over message is shown

    const isPlayerLose = game.checkIsPlayerLose();

    if (isPlayerLose) {
      game.status = 'lose';
      loseMessage.classList.remove('hidden');
    }
  }
});

function updateTable() {
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      const currentDigit = state[row][cell];

      if (!currentDigit) {
        tbody.rows[row].cells[cell].className = 'field-cell';
        tbody.rows[row].cells[cell].innerText = '';

        continue;
      }

      tbody.rows[row].cells[cell].className =
        `field-cell field-cell--${currentDigit}`;

      tbody.rows[row].cells[cell].innerText = `${currentDigit}`;
    }
  }
}
