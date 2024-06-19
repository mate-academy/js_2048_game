'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const scoreGame = document.querySelector('.game-score');

initialize();

function initialize() {
  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      startButton.className('button restart');
      startButton.textContent('Restart');
      startButton.classList.add('hidden');
      game.start();
    } else if (startButton.classList.contains('restart')) {
      startButton.className('button start');
      startButton.textContent('Start');
      startMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      scoreGame.textContent = '0';

      document.removeEventListener('keydown', handleKeyDown);
      game.restart();
    }

    document.addEventListener('keydown', handleKeyDown);
  });
}

function handleKeyDown(keyEvent) {
  keyEvent.preventDefault();

  let numbersClick = false;

  switch (keyEvent.key) {
    case 'ArrowUp':
      numbersClick = game.moveUp();
      break;

    case 'ArrowDown':
      numbersClick = game.moveDown();
      break;

    case 'ArrowLeft':
      numbersClick = game.moveLeft();
      break;

    case 'ArrowRight':
      numbersClick = game.moveRight();
      break;
  }

  if (numbersClick) {
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
  scoreGame.textContent = newScore;
}
