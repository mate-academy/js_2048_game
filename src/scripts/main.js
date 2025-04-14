'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelectorAll('.message-win');
const score = document.querySelector('.game-score');

function createMessage() {
  if (game.getStatus() === Game.gameStatus.lose) {
    loseMessage.classList.remove('hidden');
  } else if (game.getStatus() === Game.gameStatus.win) {
    winMessage.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList = 'button restart';
    startButton.innerHTML = 'Restart';
    startMessage.classList.add('hidden');
  } else if (startButton.classList.contains('restart')) {
    game.restart();
    score.innerHTML = game.getScore();
    startButton.classList = 'button start';
    startButton.innerHTML = 'Start';
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }
});

document.addEventListener('keydown', (keyEvent) => {
  keyEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  const moveActions = {
    ArrowUp: game.moveUp,
    ArrowDown: game.moveDown,
    ArrowLeft: game.moveLeft,
    ArrowRight: game.moveRight,
  };

  const action = moveActions[keyEvent.key];

  if (action) {
    action.call(game);
  }
  score.innerHTML = game.getScore();
  createMessage();
});
