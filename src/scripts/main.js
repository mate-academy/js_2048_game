'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const messageContainer = document.querySelector('.message-container');
const gameScore = document.querySelector('.game-score');

const showCurrentBoard = () => {
  const state = game.getState();
  const rows = document.querySelectorAll('.field-row');

  for (let i = 0; i < state.length; i++) {
    const row = state[i];
    const cells = rows[i].querySelectorAll('.field-cell');

    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      const cellElement = cells[j];

      if (cell) {
        cellElement.innerHTML = cell;
        cellElement.className = `field-cell field-cell--${cell}`;
      } else {
        cellElement.innerHTML = '';
        cellElement.className = 'field-cell';
      }
    }
  }
};

const showMessage = () => {
  const newStatus = game.getStatus();
  let message = '';
  let messageClass = '';

  if (newStatus === 'idle') {
    message = 'Press "Start" to begin game. Good luck!';
    messageClass = 'message-start';
  } else if (newStatus === 'playing') {
    message = '';
    messageClass = 'hidden';
  } else if (newStatus === 'win') {
    message = 'Winner! Congrats! You did it!';
    messageClass = 'message-win';
  } else if (newStatus === 'lose') {
    message = 'You lose! Restart the game?';
    messageClass = 'message-lose';
  }

  messageContainer.innerHTML = `<p class="message ${messageClass}">${message}</p>`;
};

const showScore = () => {
  gameScore.innerHTML = game.getScore();
};

const startGame = () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }
  showCurrentBoard();
  showScore();
  showMessage();
  startButton.textContent = 'Restart';
  startButton.className = 'button restart';
};

startButton.addEventListener('click', startGame);

const makeMove = (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  showScore();
  showMessage();
  showCurrentBoard();
};

document.addEventListener('keydown', makeMove);
