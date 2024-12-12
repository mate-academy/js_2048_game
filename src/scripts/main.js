'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

/**
 * Initializes the game by adding event listener to the start button.
 */
const startGame = () => {
  const startButton = document.querySelector('.start');

  startButton.addEventListener('click', () => {
    game.start();

    const messageStart = document.querySelector('.message-start');
    const restartButton = document.querySelector('.restart');

    if (messageStart) {
      messageStart.classList.add('hidden');
    }

    if (restartButton) {
      restartButton.classList.remove('hidden');
    }

    startButton.classList.add('hidden');
  });
};

/**
 * Restarts the game by adding event listener to the restart button.
 */
const restartGame = () => {
  const restartButton = document.querySelector('.restart');

  restartButton.addEventListener('click', () => {
    game.restart();
    game.updateHtmlCells();
    score();

    const messageStart = document.querySelector('.message-start');
    const startButton = document.querySelector('.start');
    const messageLose = document.querySelector('.message-lose');
    const messageWin = document.querySelector('.message-win');

    if (messageStart) {
      messageStart.classList.remove('hidden');
    }

    if (startButton) {
      startButton.classList.remove('hidden');
    }

    if (restartButton) {
      restartButton.classList.add('hidden');
    }

    if (messageLose) {
      messageLose.classList.add('hidden');
    }

    if (messageWin) {
      messageWin.classList.add('hidden');
    }
  });
};

/**
 * Listens for keydown events.
 * Moves the tiles according to the arrow key pressed.
 * Updates the game state and score after each move.
 */
const move = () => {
  document.addEventListener('keydown', (e) => {
    if (game.getStatus() === 'playing') {
      switch (e.key) {
        case 'ArrowLeft':
          game.moveLeft();
          break;

        case 'ArrowRight':
          game.moveRight();
          break;

        case 'ArrowUp':
          game.moveUp();
          break;

        case 'ArrowDown':
          game.moveDown();
          break;

        default:
          return;
      }

      game.updateHtmlCells();
      score();
      loseOrWin();
    }
  });
};

/**
 * Updates the score display on the webpage.
 */
const score = () => {
  const scoreCount = document.querySelector('.game-score');

  scoreCount.textContent = game.getScore();
};

/**
 * Listens for keydown events and displays the appropriate win or lose message.
 */
const loseOrWin = () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  } else if (gameStatus === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  startGame();
  restartGame();
  move();
});
