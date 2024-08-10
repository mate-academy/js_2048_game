'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

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

    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  setGameField();
  setGameScore();
});

document.addEventListener('keyup', (e) => {
  if (game.status === Game.STATUS.PLAYING) {
    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
    }

    setGameField();
    setGameScore();
    setMessages();
  }
});

function setGameField() {
  gameField.innerHTML = '';

  const currState = game.getState();

  for (let i = 0; i < 4; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < 4; j++) {
      const td = document.createElement('td');
      const value = currState[i][j];

      td.textContent = value === 0 ? '' : value;
      td.classList.add(`field-cell`);

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
  if (game.status === Game.STATUS.WIN) {
    messageWin.classList.remove('hidden');
  } else if (game.status === Game.STATUS.LOSE) {
    messageLose.classList.remove('hidden');
  }
}

setGameField();
setGameScore();
setMessages();
