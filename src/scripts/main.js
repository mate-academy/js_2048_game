'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');


function updateBoard() {
  const state = game.getState().flat();

  state.forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value || '';
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });

  scoreElement.textContent = game.getScore();
}


startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    startButton.classList.replace('restart', 'start');
    startButton.textContent = 'Start';
  }

  updateBoard();
  resetMessages();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const actions = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (actions[e.key]) {
    actions[e.key]();
    updateBoard();
    checkMessages();
  }
});


function checkMessages() {
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function resetMessages() {
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');
}
