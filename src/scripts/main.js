'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const scoreElement = document.querySelector('.game-score');

function updateUI() {
  game.updateBoard();

  scoreElement.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
    startButton.textContent = 'Restart';
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    startButton.textContent = 'Restart';
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.restart();
  game.start();

  updateUI();

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  messageStart.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
    switch (key) {
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
    }

    updateUI();
  }
});
