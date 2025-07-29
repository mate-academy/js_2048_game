'use strict';

const startBtn = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const tableBody = gameField.tBodies;
const tableRows = [...tableBody[0].children];
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const Game = require('../modules/Game.class');
const game = new Game();

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    getGameStatus();
    displayActualState();
    gameScore.textContent = game.getScore();
  });
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing'){
    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    }

    if (e.key === 'ArrowRight') {
      game.moveRight();
    }

    if (e.key === 'ArrowDown') {
      game.moveDown();
    }

    if (e.key === 'ArrowUp') {
      game.moveUp();
    }

    getGameStatus();
    displayActualState();
    gameScore.textContent = game.getScore();
  }

});

function displayActualState() {
  const state = game.getState();

  for (let i = 0; i < tableRows.length; i += 1) {
    const cells = [...tableRows[i].children];

    for (let j = 0; j < cells.length; j += 1) {
      cells[j].textContent = state[i][j] || '';
      cells[j].className = 'field-cell';

      if (cells[j].textContent) {
        cells[j].classList.add(`field-cell--${cells[j].textContent}`);
      }
    }
  }
}

function getGameStatus() {
  const statusGame = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (statusGame === 'idle') {
    startMessage.classList.remove('hidden');

    startBtn.classList.add('start');
    startBtn.classList.remove('restart');
    startBtn.textContent = 'Start';
  }

  if (statusGame === 'playing') {
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  }

  if (statusGame === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (statusGame === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}
