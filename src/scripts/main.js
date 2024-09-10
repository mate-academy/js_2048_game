'use strict';

// import { Game } from '../modules/Game.class.js';
// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const startBtn = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');

// keypress logic
function keyPress(e) {
  // user shouldn't be able to continue playing the already won game
  if (messageWin.classList.contains('hidden')) {
    if (startBtn.classList.contains('restart')) {
      if (e.key === 'ArrowLeft') {
        game.moveLeft();
      }

      if (e.key === 'ArrowRight') {
        game.moveRight();
      }

      if (e.key === 'ArrowUp') {
        game.moveUp();
      }

      if (e.key === 'ArrowDown') {
        game.moveDown();
      }

      // tracks if there are any changes in any direction
      // (if not then no need to add new value)

      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        updateStyles();
      }
    }
  }
}

// Updates values and styles of the game
function updateStyles() {
  const gameState = [];

  for (const row of game.state) {
    gameState.push(...row);
  }

  for (let i = 0; i < cells.length; i++) {
    // remove last added style if any
    if (cells[i].classList.length > 1) {
      cells[i].classList.remove(
        cells[i].classList[cells[i].classList.length - 1],
      );
    }

    // update value and a style
    if (gameState[i] !== 0) {
      cells[i].textContent = gameState[i];
      cells[i].classList.add(`field-cell--${gameState[i]}`);
    } else {
      cells[i].textContent = '';
    }
  }

  // updates score
  score.textContent = game.score;

  // update message in case of win/lose
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  // player can't continue playing the same game after loosing
  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

const game = new Game([
  [123, 128, 0, 8],
  [16, 8, 16, 32],
  [8, 16, 32, 64],
  [16, 32, 0, 128],
]);

startBtn.addEventListener('click', () => {
  // Change start btn styles and text to restart after pressing the btn
  if (startBtn.classList.contains('start')) {
    game.start();
  }

  if (startBtn.classList.contains('restart')) {
    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
    }

    if (!messageWin.classList.contains('hidden')) {
      messageWin.classList.add('hidden');
    }
    game.restart();
    game.start();
  }

  startBtn.classList.remove('start');
  startBtn.textContent = 'Restart';
  startBtn.classList.add('restart');

  // Remove initial message (press start)
  messageStart.classList.add('hidden');

  // Add values and styles to initial state of the game
  updateStyles();
});

document.addEventListener('keydown', keyPress);
