'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

initialize();

function initialize() {
  startBtn.addEventListener('click', handleStartClick);
  document.addEventListener('keydown', handleKeyboardActions);
}

function handleStartClick() {
  if (startBtn.classList.contains('start')) {
    startBtn.className = 'button restart';
    startBtn.textContent = 'Restart';
    startMessage.classList.add('hidden');
    game.start();
  } else {
    startBtn.className = 'button start';
    startBtn.textContent = 'Start';
    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    score.textContent = '0';

    game.restart();
  }
}

function handleKeyboardActions(keyEvent) {
  keyEvent.preventDefault();

  let didTilesMoved = false;

  switch (keyEvent.key) {
    case 'ArrowUp':
      didTilesMoved = game.moveUp();
      break;
    case 'ArrowDown':
      didTilesMoved = game.moveDown();
      break;
    case 'ArrowRight':
      didTilesMoved = game.moveRight();
      break;
    case 'ArrowLeft':
      didTilesMoved = game.moveLeft();
      break;
    default:
      break;
  }

  handleNumbersMove(didTilesMoved);
}

function handleNumbersMove(numbersMove) {
  if (numbersMove) {
    updateScore(game.getScore());
    updateStatusMessage(game.getStatus());
  }
}

function updateScore(newScore) {
  score.textContent = newScore;
}

function updateStatusMessage(newStatus) {
  if (newStatus === Game.Status.win) {
    winMessage.classList.remove('hidden');
  } else if (newStatus === Game.Status.lose) {
    loseMessage.classList.remove('hidden');
  }
}
