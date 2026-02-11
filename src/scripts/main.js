'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  window.game = game;

  game.initDom();

  const startButton = document.querySelector('.start');
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const scoreElement = document.querySelector('.game-score');

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() === 'idle') {
      let moved = false;

      game.start();

      if (e.key === 'ArrowLeft') {
        moved = game.moveLeft();
      }

      if (e.key === 'ArrowRight') {
        moved = game.moveRight();
      }

      if (e.key === 'ArrowUp') {
        moved = game.moveUp();
      }

      if (e.key === 'ArrowDown') {
        moved = game.moveDown();
      }

      if (moved) {
        if (startButton.classList.contains('start')) {
          startButton.classList.remove('start');
          startButton.classList.add('restart');
          startButton.textContent = 'Restart';
        }
      }

      updateUI();
    }
  });

  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      game.start();
      updateUI();
      updateScore();
    } else {
      startButton.classList.remove('restart');
      startButton.classList.add('start');
      startButton.textContent = 'Start';
      game.restart();
      updateUI();
      updateScore();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    if (e.key === 'ArrowLeft') {
      moved = game.moveLeft();
    }

    if (e.key === 'ArrowRight') {
      moved = game.moveRight();
    }

    if (e.key === 'ArrowUp') {
      moved = game.moveUp();
    }

    if (e.key === 'ArrowDown') {
      moved = game.moveDown();
    }

    if (moved) {
      if (startButton.classList.contains('start')) {
        startButton.classList.remove('start');
        startButton.classList.add('restart');
        startButton.textContent = 'Restart';
      }
    }

    updateUI();
    updateScore();
  });

  function updateUI() {
    if (game.getStatus() === 'win') {
      hideAllMessages();
      winMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      hideAllMessages();
      loseMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'idle') {
      hideAllMessages();
      startMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'playing') {
      hideAllMessages();
    }
  }

  function updateScore() {
    scoreElement.textContent = game.getScore();
  }

  function hideAllMessages() {
    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }
});
