'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.querySelector('.button').addEventListener('click', () => {
  const button = document.querySelector('.button');

  // which button is display start/restart
  switch (true) {
    case button.classList.contains('start'): {
      game.start();

      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
      break;
    }

    case button.classList.contains('restart'): {
      game.restart();

      button.classList.remove('restart');
      button.classList.add('start');
      button.textContent = 'Start';
    }
  }

  renderUserScore();
  renderGameBoard();

  // refreshing classes for messages
  const startMessage = document.querySelector('.message-start');
  const loseMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');

  startMessage.classList.add('hidden');

  if (!loseMessage.classList.contains('hidden')) {
    loseMessage.classList.add('hidden');
  }

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }
});

// allow use keyboard to control cells
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  renderUserScore();
  renderGameBoard();
  isGameOver();
});

function renderGameBoard() {
  const board = game.getState();
  const boardHTML = document.querySelectorAll('.field-row');

  for (let row = 0; row < boardHTML.length; row++) {
    const boardRowHTML = boardHTML[row].querySelectorAll('.field-cell');

    for (let col = 0; col < boardHTML.length; col++) {
      if (board[row][col] !== 0) {
        boardRowHTML[col].textContent = board[row][col];

        boardRowHTML[col].className =
          `field-cell field-cell--${board[row][col]}`;
      } else {
        boardRowHTML[col].textContent = '';
        boardRowHTML[col].className = 'field-cell';
      }
    }
  }
}

function renderUserScore() {
  const userScore = game.getScore();

  document.querySelector('.game-score').textContent = userScore;
}

function isGameOver() {
  switch (game.getStatus()) {
    case 'win': {
      const loseMessage = document.querySelector('.message-win');

      loseMessage.classList.remove('hidden');

      break;
    }

    case 'lose': {
      const loseMessage = document.querySelector('.message-lose');

      loseMessage.classList.remove('hidden');

      break;
    }
  }
}
