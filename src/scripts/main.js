'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const undoButton = document.querySelector('.undo'); // New undo button

initialize();

function initialize() {
  button.addEventListener('click', () => {
    if (button.classList.contains('start')) {
      button.className = 'button restart';
      button.textContent = 'Restart';
      messageStart.classList.add('hidden');
      game.start();
    } else {
      button.className = 'button start';
      button.textContent = 'Start';
      messageStart.classList.remove('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
      document.removeEventListener('keydown', handleKeyDown);
      game.restart();
    }
    document.addEventListener('keydown', handleKeyDown);
  });

  // Event listener for the undo button
  undoButton.addEventListener('click', () => {
    game.undo(); // Call the undo method
    updateScore(game.getScore());
  });
}

function handleKeyDown(keyEvent) {
  keyEvent.preventDefault();

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

    const currentGameStatus = game.getStatus();

    if (currentGameStatus === Game.Status.lose) {
      messageLose.classList.remove('hidden');
    } else if (currentGameStatus === Game.Status.win) {
      messageWin.classList.remove('hidden');
    }
  }
}

function updateScore(newScore) {
  score.textContent = newScore;
}

