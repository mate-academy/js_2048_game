'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

initialize();

function initialize() {
  startBtn.addEventListener('click', () => {
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

      document.removeEventListener('keydown', handleKeyDown);
      game.restart();
    }

    document.addEventListener('keydown', handleKeyDown);
  });
}

function handleKeyDown(keyEvent) {
  keyEvent.preventDefault();

  let numbersMove = false;

  switch (keyEvent.key) {
    case 'ArrowUp':
      numbersMove = game.moveUp();
      break;

    case 'ArrowDown':
      numbersMove = game.moveDown();
      break;

    case 'ArrowRight':
      numbersMove = game.moveRight();
      break;

    case 'ArrowLeft':
      numbersMove = game.moveLeft();
      break;
  }

  if (numbersMove) {
    updateScore(game.getScore());

    const newStatus = game.getStatus();

    if (newStatus === Game.Status.lose) {
      loseMessage.classList.remove('hidden');
    } else if (newStatus === Game.Status.win) {
      winMessage.classList.remove('hidden');
    }
  }
}

function updateScore(newScore) {
  score.textContent = newScore;
}
