'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button');
const scoreText = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const tableRows = document.querySelector('.game-field').tBodies[0].rows;

const renderState = () => {
  const state = game.getState();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!state[i][j]) {
        tableRows[i].children[j].textContent = '';
        tableRows[i].children[j].className = '';

        tableRows[i].children[j].classList.add('field-cell');
        continue;
      }
      tableRows[i].children[j].textContent = state[i][j];
      tableRows[i].children[j].className = '';

      tableRows[i].children[j].classList.add(
        'field-cell',
        `field-cell--${state[i][j]}`,
      );
    }
  }
};

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    startMessage.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    game.restart();
    game.start();
  }

  renderState();
});

document.addEventListener('keydown', (e) => {
  let boardChanged = false;
  let gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      boardChanged = game.moveLeft();
      break;
    case 'ArrowRight':
      boardChanged = game.moveRight();
      break;
    case 'ArrowUp':
      boardChanged = game.moveUp();
      break;
    case 'ArrowDown':
      boardChanged = game.moveDown();
      break;
  }

  if (!boardChanged) {
    return;
  }

  gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  scoreText.textContent = game.getScore();
  renderState();
});
