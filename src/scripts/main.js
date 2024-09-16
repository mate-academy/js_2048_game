'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const button = document.querySelector('button.button');
const rows = document.querySelectorAll('.field-row');

const renderCurrentState = () => {
  const state = game.getState();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state.length; j++) {
      const number = state[i][j];
      const cell = rows.item(i).children.item(j);

      cell.className = 'field-cell';
      cell.textContent = '';

      if (number !== 0) {
        cell.classList.add(`field-cell--${number}`);
        cell.textContent = number;
      }
    }
  }
};

const updateGameScore = (newScore) => {
  gameScore.innerText = newScore;
  gameScore.value = newScore;
};

document.addEventListener('keydown', ({ key }) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'playing') {
    if (key === 'ArrowLeft') {
      game.moveLeft();
    }

    if (key === 'ArrowRight') {
      game.moveRight();
    }

    if (key === 'ArrowUp') {
      game.moveUp();
    }

    if (key === 'ArrowDown') {
      game.moveDown();
    }

    renderCurrentState();
  }

  updateGameScore(game.getScore());
});

const setGame = () => {
  game.start();
  renderCurrentState();

  messageStart.classList.add('hidden');
};

const resetGame = () => {
  game.restart();
  renderCurrentState();
  updateGameScore(game.getScore());

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
};

button.addEventListener('click', ({ target }) => {
  resetGame();
  setGame();

  target.classList.remove('start');
  target.classList.add('restart');
  target.innerText = 'Restart';
  target.style.fontSize = '17px';
});
