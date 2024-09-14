'use strict';

// const initialState = [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
// ];

const { getCapitalizedWord } = require('./utils');

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const button = document.querySelector('.button');
const tbody = document.querySelector('tbody');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  const onClickClasses = button.className.split(' ');

  if (onClickClasses[1] === 'start') {
    game.start();

    manageMessage();
  }

  if (onClickClasses[1] === 'restart') {
    game.restart();

    manageMessage();
  }

  changeField();

  button.classList.toggle('start');
  button.classList.toggle('restart');

  const afterClickClasses = button.className.split(' ');

  button.textContent = getCapitalizedWord(afterClickClasses[1]);
});

const moveKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];

document.addEventListener('keydown', (e) => {
  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  if (moveKeys.includes(e.key)) {
    changeField();
    manageMessage();
  }
});

function changeField() {
  const currState = game.getState();

  currState.forEach((line, index) => {
    const tr = document.createElement('tr');

    tr.classList.add('field-row');

    line.forEach((item) => {
      const td = document.createElement('td');

      td.classList.add('field-cell');

      if (item) {
        td.classList.add(`field-cell--${item}`);
      }

      td.textContent = item || '';

      tr.appendChild(td);
    });

    tbody.replaceChild(tr, tbody.rows[index]);
  });

  score.textContent = game.getScore();
}

function manageMessage() {
  const gameStatus = game.getStatus();

  switch (gameStatus) {
    case 'idle':
      startMessage.classList.remove('hidden');

      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');

      break;

    case 'playing':
      startMessage.classList.add('hidden');
      break;

    case 'win':
      winMessage.classList.remove('hidden');
      break;

    case 'lose':
      loseMessage.classList.remove('hidden');
      break;

    default:
      break;
  }
}
