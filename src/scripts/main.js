'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameScoreElement = document.querySelector('.game-score');
const buttonElement = document.querySelector('.button');

gameScoreElement.textContent = game.getScore();
refreshGameInterface();

function startGame() {
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  buttonElement.classList.remove('start');
  buttonElement.classList.add('restart');
  buttonElement.textContent = 'Restart';
  document.querySelector('.message-start').classList.add('hidden');
  game.start();
  refreshGameInterface();
}

function restartGame() {
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  buttonElement.classList.remove('restart');
  buttonElement.classList.add('start');
  buttonElement.textContent = 'Start';
  document.querySelector('.message-start').classList.remove('hidden');
  game.restart();
  refreshGameInterface();
}

buttonElement.addEventListener('click', () => {
  if (buttonElement.classList.contains('start')) {
    startGame();
  } else if (buttonElement.classList.contains('restart')) {
    restartGame();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowDown':
        game.moveDown();
        refreshGameInterface();
        break;
      case 'ArrowUp':
        game.moveUp();
        refreshGameInterface();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        refreshGameInterface();
        break;
      case 'ArrowRight':
        game.moveRight();
        refreshGameInterface();
        break;
    }
  }
});

function refreshGameInterface() {
  const cellElements = [...document.querySelectorAll('td')];
  const gameState = game.getState();
  let counter = 0;

  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      if (gameState[i][j] === 0) {
        cellElements[counter].className = 'field-cell';
        cellElements[counter].textContent = '';
      } else {
        cellElements[counter].className = 'field-cell';
        cellElements[counter].textContent = gameState[i][j];
        cellElements[counter].classList.add(`field-cell--${gameState[i][j]}`);
      }
      counter++;
    }
  }

  gameScoreElement.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}
