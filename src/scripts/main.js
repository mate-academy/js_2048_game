'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelectorAll('.message-win');
const gameScore = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList = 'button restart';
    startButton.innerHTML = 'Restart';
    startMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    getScore();
  } else if (startButton.classList.contains('restart')) {
    game.restart();
    startButton.classList = 'button start';
    startButton.innerHTML = 'Start';
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    getScore();
  }
});

document.addEventListener('keydown', (e) => {
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
  }

  getScore();
  updateMessages();
});

function updateMessages() {
  if (game.getStatus() === Game.STATUS.lose) {
    loseMessage.classList.remove('hidden');
  } else if (game.getStatus() === Game.STATUS.win) {
    winMessage.classList.remove('hidden');
  }
}

function getScore() {
  gameScore.textContent = game.getScore();
}
