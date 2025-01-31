'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// Write your code here

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateBoard() {
  const state = game.getState();
  let index = 0;

  state.flat().forEach((value) => {
    cells[index].textContent = value || '';

    cells[index].className =
      `field-cell ${value ? `field-cell--${value}` : ''}`;
    index++;
  });

  scoreElement.textContent = game.getScore();
}

function checkStatus() {
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    // eslint-disable-next-line no-useless-return
    return;
  }

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (moves[e.key]) {
    moves[e.key]();
    updateBoard();
    checkStatus();
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.classList.replace('start', 'restart');
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  updateBoard();
});
