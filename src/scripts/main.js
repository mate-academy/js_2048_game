/* eslint-disable no-console */
'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const entireGame = document.getElementsByTagName('body')[0];
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const fields = document.querySelectorAll('.field-cell');

entireGame.addEventListener('keydown', keypressHandler);
startButton.addEventListener('click', startGame);

function keypressHandler(e) {
  if (e.key === 'Escape') {
    restartGame();
  }

  if (e.key === 'Enter') {
    startGame();
  }

  if (game.getStatus() === 'playing') {
    if (e.key === 'ArrowUp') {
      updateBoard(game.moveUp());
    }

    if (e.key === 'ArrowDown') {
      updateBoard(game.moveDown());
    }

    if (e.key === 'ArrowLeft') {
      updateBoard(game.moveLeft());
    }

    if (e.key === 'ArrowRight') {
      updateBoard(game.moveRight());
    }
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function updateBoard(initialState) {
  const gameValues = initialState.flat();

  fields.forEach((field, index) => {
    const value = gameValues[index] || 0;

    field.innerHTML = value === 0 ? '' : value;
  });

  gameScore.innerText = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lost') {
    messageLose.classList.remove('hidden');
  }
}

function restartGame() {
  messageStart.classList.remove('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const initialState = game.restart();

  updateBoard(initialState);
}

function startGame() {
  if (game.getStatus() === 'idle') {
    const initialState = game.start();

    startButton.innerText = 'Restart';

    updateBoard(initialState);

    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  if (game.getStatus() === 'playing') {
    restartGame();
  }
}
