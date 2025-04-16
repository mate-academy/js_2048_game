'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

let gameStarted = false;

function renderCells() {
  const fieldCells = document.querySelectorAll('.field-cell');
  const flatState = game.state.flat();

  fieldCells.forEach((cell, index) => {
    const value = flatState[index];

    cell.classList.forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    cell.innerText = '';

    if (value) {
      cell.innerText = value === 0 ? '' : value;
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore() {
  const scoreElement = document.querySelector('.game-score');

  scoreElement.innerText = game.score;
}

function moveKeys() {
  if (event.key === 'ArrowLeft') {
    game.moveLeft();
    renderCells();
    renderScore();
    checkStatus();
  }

  if (event.key === 'ArrowRight') {
    game.moveRight();
    renderCells();
    renderScore();
    checkStatus();
  }

  if (event.key === 'ArrowDown') {
    game.moveDown();
    renderCells();
    renderScore();
    checkStatus();
  }

  if (event.key === 'ArrowUp') {
    game.moveUp();
    renderCells();
    renderScore();
    checkStatus();
  }

  return false;
}

function checkStatus() {
  const winMessage = document.querySelector('.message-win');
  const lostMessage = document.querySelector('.message-lose');

  switch (game.status) {
    case 'win':
      winMessage.classList.remove('hidden');
      break;
    case 'lose':
      lostMessage.classList.remove('hidden');
      break;
  }
}

function init() {
  if (!gameStarted) {
    const restartButton = document.querySelector('button');

    game.start();
    renderCells();
    gameStarted = true;
    restartButton.innerText = 'Restart';
    restartButton.classList.add('restart');
  }
}

function restartGame() {
  game.score = 0;

  game.restart();
  game.start();
  renderCells();
  renderScore();
}

document.querySelector('.button').addEventListener('click', function () {
  if (!gameStarted) {
    document.querySelector('.message-start').classList.add('hidden');
    init();
  } else {
    restartGame();
  }
});

document.addEventListener('keydown', moveKeys);
