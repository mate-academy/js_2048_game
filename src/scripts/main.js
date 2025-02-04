'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const buttonStart = document.querySelector('.button.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    game.start();
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';
    changeStatusMessage();
    updateTable();
  } else {
    game.restart();
    buttonStart.classList.add('start');
    buttonStart.classList.remove('restart');
    buttonStart.textContent = 'Start';
    changeStatusMessage();
    updateTable();
    changeScore();
  }
});

document.addEventListener('keydown', (e) => {
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
    default:
      break;
  }
  updateTable();
  changeScore();
  changeStatusMessage();
});

function changeStatusMessage() {
  const gameStatus = game.status;

  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  switch (gameStatus) {
    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
    case 'win':
      winMessage.classList.remove('hidden');
      break;
    case 'idle':
      startMessage.classList.remove('hidden');
      break;
    default:
      break;
  }
}

function updateTable() {
  const tableRows = document.querySelectorAll('tbody tr');

  for (let stateRow = 0; stateRow < 4; stateRow++) {
    const tableColumns = tableRows[stateRow].querySelectorAll('td');

    for (let stateColumn = 0; stateColumn < 4; stateColumn++) {
      const currentCell = tableColumns[stateColumn];
      const newValue = game.state[stateRow][stateColumn] || '';

      currentCell.textContent = newValue;

      currentCell.classList.forEach((cls) => {
        if (cls.startsWith('field-cell--')) {
          currentCell.classList.remove(cls);
        }
      });
      currentCell.classList.add(`field-cell--${newValue}`);
    }
  }
}

function changeScore() {
  score.textContent = game.getScore();
}
