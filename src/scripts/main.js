'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function updateButton(newClass, text) {
  button.classList.remove('start', 'restart');
  button.classList.add(newClass);
  button.textContent = text;
}

function toggleMessages(messagesToShow = []) {
  const messages = [messageStart, messageLose, messageWin];

  messages.forEach((msg) => msg.classList.add('hidden'));
  messagesToShow.forEach((msg) => msg.classList.remove('hidden'));
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    updateButton('restart', 'Restart');
    toggleMessages();
  } else {
    game.restart();
    updateButton('start', 'Start');
    toggleMessages([messageStart]);
  }

  setGameField();
  setGameScore();
});

const keyActions = {
  ArrowRight: () => game.moveRight(),
  ArrowLeft: () => game.moveLeft(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keyup', (e) => {
  if (keyActions[e.key]) {
    keyActions[e.key]();
    setGameField();
    setGameScore();
    setMessages();
  }
});

function setGameField() {
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

function setGameScore() {
  gameScore.textContent = game.getScore();
}

function setMessages() {
  if (game.getStatus() === Game.STATUS.win) {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === Game.STATUS.lose) {
    messageLose.classList.remove('hidden');
  }
}

setGameField();
setGameScore();
setMessages();
