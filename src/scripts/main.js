'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const rows = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');
const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameField = [];
let firstMove = false;

rows.forEach((row) => {
  const cells = row.querySelectorAll('td');

  gameField.push(cells);
});

const handleKeyPress = (e) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!keys.includes(e.key)) {
    return;
  }
  e.preventDefault();

  if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
    return;
  }

  if (!firstMove) {
    firstMove = true;
    game.start();
  }

  const prevState = JSON.stringify(game.getState());

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

  if (prevState !== JSON.stringify(game.getState())) {
    game.addNewNumber();
  }
  changeButton();
  updateGameInterface();
};

document.addEventListener('keyup', handleKeyPress);

button.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    changeButton();
    firstMove = true;
    game.start();
    updateGameInterface();
  } else {
    game.restart();
    changeButton();
    updateGameInterface();
  }
});

function updateGameInterface() {
  showFields();
  score.textContent = game.getScore();

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function showFields(field = gameField, state = game.getState()) {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      const cell = field[i][j];
      const value = state[i][j];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    }
  }
}

function changeButton() {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  if (!messageStart.classList.contains('hidden')) {
    messageStart.classList.add('hidden');
  }

  if (!messageWin.classList.contains('hidden')) {
    messageWin.classList.add('hidden');
  }

  if (!messageLose.classList.contains('hidden')) {
    messageLose.classList.add('hidden');
  }
}
