'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function initialize() {
  button.addEventListener('click', () => {
    if (button.classList.contains('start')) {
      button.className = 'button restart';
      button.textContent = 'Restart';

      game.start();
      messageStart.classList.add('hidden');
    } else {
      button.className = 'button start';
      button.textContent = 'Start';

      game.restart();
      messageStart.classList.remove('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
      document.removeEventListener('keydown', handleKeyDown);
    }

    document.addEventListener('keydown', handleKeyDown);
  });
}

initialize();

function handleKeyDown(keyEvent) {
  keyEvent.preventDefault();

  if (game.getStatus() !== Game.Status.playing) {
    return;
  }

  let didTilesMove = false;

  switch (keyEvent.key) {
    case 'ArrowUp':
      didTilesMove = game.moveUp();
      break;

    case 'ArrowDown':
      didTilesMove = game.moveDown();
      break;

    case 'ArrowRight':
      didTilesMove = game.moveRight();
      break;

    case 'ArrowLeft':
      didTilesMove = game.moveLeft();
      break;
  }

  if (didTilesMove) {
    updateScore(game.getScore());

    if (game.getStatus() === Game.Status.lose) {
      handleLostGame();
    } else if (game.getStatus() === Game.Status.win) {
      handleWonGame();
    }
  }
}

function handleLostGame() {
  messageLose.classList.remove('hidden');
}

function handleWonGame() {
  messageWin.classList.remove('hidden');
}

function updateScore(newScore) {
  score.textContent = newScore;
}
