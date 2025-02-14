'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

document.querySelector('.start').addEventListener(
  'click',
  () => {
    game.start();
    renderUserScore();
    renderGameBoard();

    // change start button to restart button
    const startButton = document.querySelector('.button');

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';

    document.querySelector('.restart').addEventListener('click', () => {
      game.restart();
      renderUserScore();
      renderGameBoard();
    });

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

    // allow use keyboard to control
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          game.moveUp();
          renderUserScore();
          isGameOver();

          break;
        case 'ArrowDown':
          game.moveDown();
          renderUserScore();
          isGameOver();

          break;
        case 'ArrowLeft':
          game.moveLeft();
          renderUserScore();
          isGameOver();

          break;
        case 'ArrowRight':
          game.moveRight();
          renderUserScore();
          isGameOver();

          break;
      }
    });
  },
  { once: true },
);

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
    case 'playing': {
      game.createNewCellInBoard();
      renderGameBoard();
      break;
    }

    case 'win': {
      // eslint-disable-next-line no-console
      console.log('win');
      renderGameBoard();

      break;
    }

    case 'lose': {
      renderGameBoard();

      const loseMessage = document.querySelector('.message-lose');

      loseMessage.classList.remove('hidden');

      // document.removeEventListener('keydown', () => {});
      break;
    }
  }
}
