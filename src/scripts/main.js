'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const score = document.querySelector('.game-score');
const field = document.querySelector('.game-field');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

startBtn.addEventListener('click', () => {
  switch (true) {
    case startBtn.classList.contains('start'):
      game.start();

      startBtn.classList.remove('start');
      startBtn.classList.add('restart');
      startBtn.textContent = 'Restart';
      break;

    case startBtn.classList.contains('restart'):
      game.restart();

      startBtn.classList.remove('restart');
      startBtn.classList.add('start');
      startBtn.textContent = 'Start';
      break;
  }

  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  manageField();
  gameScore();
  switchMessages();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
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
  }

  manageField();
  gameScore();
  switchMessages();
});

function gameScore() {
  score.textContent = game.getScore();
}

function switchMessages() {
  switch (game.getStatus()) {
    case Game.STATUS.win:
      winMessage.classList.remove('hidden');
      break;
    case Game.STATUS.lose:
      loseMessage.classList.remove('hidden');
      break;
  }
}

function manageField() {
  field.innerHTML = '';

  const currState = game.getState();

  currState.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');

    row.forEach((value, colIndex) => {
      const td = document.createElement('td');

      td.textContent = value !== 0 ? value : '';
      td.classList.add('field-cell');

      if (value !== 0) {
        td.classList.add(`field-cell--${value}`);
      }

      tr.appendChild(td);
    });

    field.appendChild(tr);
  });
}

gameScore();
manageField();
switchMessages();
