'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const start = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.className = 'button restart';
    start.textContent = 'Restart';
    startMessage.classList.add('hidden');
    game.start();
  } else {
    start.className = 'button start';
    start.textContent = 'Start';
    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    score.textContent = '0';

    game.restart();
  }
});

document.addEventListener('keyup', (keyEvent) => {
  keyEvent.preventDefault();

  const arrowUp = 'ArrowUp';
  const arrowDown = 'ArrowDown';
  const arrowRight = 'ArrowRight';
  const arrowLeft = 'ArrowLeft';

  switch (keyEvent.key) {
    case arrowUp:
      game.moveUp();
      break;
    case arrowDown:
      game.moveDown();
      break;
    case arrowRight:
      game.moveRight();
      break;
    case arrowLeft:
      game.moveLeft(); // Don't forget to add moveLeft function call
      break;
  }

  score.textContent = game.getScore();
  handleMoveOutcome();
});

function handleMoveOutcome(numbersMove) {
  const newStatus = game.getStatus();

  if (newStatus === Game.Status.win) {
    winMessage.classList.remove('hidden');
  } else if (newStatus === Game.Status.lose) {
    loseMessage.classList.remove('hidden');
  }
}
