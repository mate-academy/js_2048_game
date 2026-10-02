'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messages = document.querySelectorAll('.message');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

button.addEventListener('click', (press) => {
  if (button.classList.contains('start')) {
    button.className = 'button restart';
    button.textContent = 'Restart';
    hideMesages();
    game.start();
  }

  if (button.classList.contains('restart')) {
    score.textContent = '0';
    hideMesages();
    game.restart();
  }
});

document.addEventListener('keydown', (clickEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (clickEvent.key) {
    case 'ArrowLeft':
      game.moveLeft();
      score.textContent = game.getScore();
      gameOver();
      break;
    case 'ArrowRight':
      game.moveRight();
      score.textContent = game.getScore();
      gameOver();
      break;
    case 'ArrowUp':
      game.moveUp();
      score.textContent = game.getScore();
      gameOver();
      break;
    case 'ArrowDown':
      game.moveDown();
      score.textContent = game.getScore();
      gameOver();
      break;
    default:
      break;
    // не наша клавіша — нічого не робимо
  }
});

function gameOver() {
  if (game.status === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.status === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

function hideMesages() {
  for (const message of messages) {
    if (!message.classList.contains('hidden')) {
      message.classList.add('hidden');
    }
  }
}
