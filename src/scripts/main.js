'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const gameButton = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const gameField = document.querySelector('.game-field');

document.addEventListener('keyup', (arrow) => {
  if (game.status === 'playing') {
    switch (arrow.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      default:
        break;
    }

    updateUi(game.board);

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
    }
  }
});

function updateUi(board) {
  const cells = gameField.querySelectorAll('.field-cell');

  board.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value > 0 ? `field-cell--${value}` : ''}`;
  });

  gameScore.textContent = game.getScore();
}

gameButton.addEventListener('click', (e) => {
  const button = e.target;

  if (button.classList.contains('start')) {
    game.start();
    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';

    messageStart.classList.add('hidden');
    updateUi(game.board);
  } else {
    game.restart();

    button.classList.replace('restart', 'start');
    button.textContent = 'Start';

    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    updateUi(game.board);
  }
});
