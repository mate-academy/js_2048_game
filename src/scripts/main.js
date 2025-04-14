'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.getElementsByClassName('game-field')[0];
const startButton = document.getElementsByClassName('button start')[0];
const score = document.getElementsByClassName('game-score')[0];
const startMessage = document.getElementsByClassName('message-start')[0];
const loseMessage = document.getElementsByClassName('message-lose')[0];
const winMessage = document.getElementsByClassName('message-win')[0];

startButton.addEventListener('click', () => {
  const isStarting = startButton.classList.contains('start');

  if (isStarting) {
    game.start();
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    startButton.textContent = 'Start';
  }
  startButton.classList.toggle('start');
  startButton.classList.toggle('restart');

  hideMessages();

  if (!isStarting) {
    startMessage.classList.remove('hidden');
  }
  updateField();
  updateScore();
  checkGameStatus();
});

document.addEventListener('keydown', (e) => {
  const moves = {
    ArrowRight: 'moveRight',
    ArrowLeft: 'moveLeft',
    ArrowUp: 'moveUp',
    ArrowDown: 'moveDown',
  };

  if (moves[e.key]) {
    game[moves[e.key]]();
    updateField();
    updateScore();
    checkGameStatus();
  }
});

function updateScore() {
  score.textContent = game.getScore();
}

function hideMessages() {
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
}

function checkGameStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === Game.STATUS.win) {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === Game.STATUS.lose) {
    loseMessage.classList.remove('hidden');
  }
}

function updateField() {
  gameField.innerHTML = '';

  game.getState().forEach((row) => {
    const tr = document.createElement('tr');

    row.forEach((value) => {
      const td = document.createElement('td');

      if (value !== 0) {
        td.textContent = value;
      } else {
        td.textContent = '';
      }
      td.className = `field-cell${value ? ` field-cell--${value}` : ''}`;
      tr.appendChild(td);
    });
    gameField.appendChild(tr);
  });
}
