'use strict';

// Uncomment the next lines to use your game instance in the browser
import { Game } from '../modules/Game.class';

const game = new Game();

window.game = game;

const actionButton = document.querySelector('.button.start');

function updateActionButton() {
  if (!actionButton) {
    return;
  }

  if (game.isFirstMove) {
    actionButton.textContent = 'Start';
    actionButton.className = 'button start';
  } else {
    actionButton.textContent = 'Restart';
    actionButton.className = 'button restart';
  }
}

function updateMessages() {
  const gameStatus = game.getStatus();

  const getWin = document.querySelector('.message-win');
  const getLose = document.querySelector('.message-lose');
  const getPlaying = document.querySelector('.message-start');

  getWin.classList.add('hidden');
  getLose.classList.add('hidden');
  getPlaying.classList.add('hidden');

  if (gameStatus === 'win') {
    getWin.textContent = 'Winner! Congrats! You did it!';
    getWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    getLose.textContent = 'You lose! Restart the game?';
    getLose.classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    getPlaying.classList.remove('hidden');
  } else if (gameStatus === 'running') {
  }
}

function updateUI() {
  const board = game.getState();
  const scoreElement = document.querySelector('.game-score');
  const cells = document.querySelectorAll('.field-cell');

  if (scoreElement) {
    scoreElement.textContent = game.score;
  }

  const flatBoard = board.flat();

  cells.forEach((cell, index) => {
    const value = flatBoard[index];

    cell.textContent = value > 0 ? value : '';

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  updateMessages();
}

if (actionButton) {
  actionButton.addEventListener('click', () => {
    if (actionButton.textContent === 'Start') {
      game.start();
      game.isFirstMove = false;
    } else {
      game.restart();
    }
    updateUI();
    updateActionButton();
    updateMessages();
  });
}

window.addEventListener('keydown', (e) => {
  let success = false;

  switch (e.key) {
    case 'ArrowUp':
      success = game.moveUp();
      break;
    case 'ArrowDown':
      success = game.moveDown();
      break;
    case 'ArrowLeft':
      success = game.moveLeft();
      break;
    case 'ArrowRight':
      success = game.moveRight();
      break;
    default:
      return;
  }

  if (success) {
    updateUI();
    updateActionButton();
    updateMessages();
  }
});
