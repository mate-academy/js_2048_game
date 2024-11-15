/* eslint-disable max-len */
/* eslint-disable no-console */
'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');


const fields = document.querySelectorAll('.field-cell');

document.addEventListener('keydown', keypressHandler);
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
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';
  }
}

function updateBoard(initialState) {

  const gameValues = initialState.flat();


  fields.forEach((field, index) => {
    field.textContent = gameValues[index] || "";
  });

  const score = game.getScore();

  gameScore.textContent = score;

  const statuss = game.getStatus();


  if (statuss === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statuss === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function restartGame() {
  messageStart.classList.remove('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  startButton.classList.add('start');
  startButton.classList.remove('restart');
  startButton.textContent = 'Start';
  const initialState = game.restart();

  updateBoard(initialState);
}

function startGame() {
  const gameStatus = game.getStatus();
  if (game.getStatus() === 'idle') {
    const initialState = game.start();
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    startButton.classList.remove('start');

    updateBoard(initialState);

    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    return
  }

  if (game.getStatus() === 'playing') {
    restartGame();
    return
  }
}
