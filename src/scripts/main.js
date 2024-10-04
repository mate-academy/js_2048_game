'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';

    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  } else if (startButton.classList.contains('restart')) {
    game.restart();

    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';

    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  updateGameField();
  setScore();
});

document.addEventListener('keyup', (e) => {
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

  updateGameField();
  setScore();
  setMessage();
});

function updateGameField() {
  gameField.innerHTML = '';

  const currentState = game.getState();

  for (let row = 0; row < 4; row++) {
    const tr = document.createElement('tr');

    for (let col = 0; col < 4; col++) {
      const td = document.createElement('td');
      const value = currentState[row][col];

      td.textContent = value !== 0 ? value : '';
      td.classList.add('field-cell');

      if (value !== 0) {
        td.classList.add(`field-cell--${value}`);
      }

      tr.appendChild(td);
    }

    gameField.appendChild(tr);
  }
}

function setScore() {
  if (gameScore) {
    gameScore.textContent = game.getScore();
  }
}

function setMessage() {
  const currStatus = game.getStatus();

  messageWin.classList.toggle('hidden', currStatus !== Game.gameStatus.win);
  messageLose.classList.toggle('hidden', currStatus !== Game.gameStatus.lose);
}

updateGameField();
setMessage();
setScore();
