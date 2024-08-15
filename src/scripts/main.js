'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const button = document.querySelector('.start');

const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  } else if (button.classList.contains('restart')) {
    game.restart();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  manageGameField();
  manageGameScore();
  manageMessages();
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
  manageGameField();
  manageGameScore();
  manageMessages();
});

function manageGameField() {
  gameField.innerHTML = '';

  const currState = game.getState();

  for (let r = 0; r < 4; r++) {
    const tr = document.createElement('tr');

    for (let c = 0; c < 4; c++) {
      const td = document.createElement('td');
      const value = currState[r][c];

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

function manageGameScore() {
  gameScore.textContent = game.getScore();
}

function manageMessages() {
  if (game.getStatus() === Game.Status.win) {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === Game.Status.lose) {
    messageLose.classList.remove('hidden');
  }
}

manageGameField();
manageGameScore();
manageMessages();
