'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const elements = {
  startButton: document.querySelector('.start'),
  messageStart: document.querySelector('.message-start'),
  winMessage: document.querySelector('.message-win'),
  loseMessage: document.querySelector('.message-lose'),
  scoreDisplay: document.querySelector('.game-score'),
};

initialize();

function initialize() {
  elements.startButton.addEventListener('click', () => {
    if (elements.startButton.classList.contains('start')) {
      elements.startButton.className = 'button restart';
      elements.startButton.textContent = 'Restart';

      elements.messageStart.classList.add('hidden');
      game.start();
    } else {
      elements.startButton.className = 'button start';
      elements.startButton.textContent = 'Start';
      elements.scoreDisplay.textContent = '0';

      elements.messageStart.classList.remove('hidden');
      elements.winMessage.classList.add('hidden');
      elements.loseMessage.classList.add('hidden');

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
      elements.loseMessage.classList.remove('hidden');
    } else if (newStatus === Game.Status.win) {
      elements.winMessage.classList.remove('hidden');
    }
  }
}

function updateScore(newScore) {
  elements.scoreDisplay.textContent = newScore;
}
