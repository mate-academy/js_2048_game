'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
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

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      game.moveUp();
      break;
    case 'ArrowDown':
    case 's':
      game.moveDown();
      break;
    case 'ArrowLeft':
    case 'a':
      game.moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
      game.moveRight();
      break;
  }

  getScore();
  updateMessages();
});

function updateMessages() {
  if (game.getStatus() === Game.gameStatus.lose) {
    loseMessage.classList.remove('hidden');
  } else if (game.getStatus() === Game.gameStatus.win) {
    winMessage.classList.remove('hidden');
  }
}

function getScore() {
  gameScore.innerHTML = game.getScore();
}
