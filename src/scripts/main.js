'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.score');
const mainButton = document.querySelector('button');
const startMessage = document.querySelector('.start-message');
const winMessage = document.querySelector('.win-message');
const gameOverMessage = document.querySelector('.game-over-message');

function updateUI() {
  const state = game.getState();
  const gameStatus = game.getStatus();
  const score = game.getScore();

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
      cellIndex++;
    }
  }

  const mensagens = [startMessage, winMessage, gameOverMessage];

  mensagens.forEach((msg) => {
    if (msg) {
      msg.classList.add('hidden');
    }
  });

  if (gameStatus === 'idle') {
    if (startMessage) {
      startMessage.classList.remove('hidden');
    }

    if (mainButton) {
      mainButton.textContent = 'Start';
      mainButton.classList.add('start');
      mainButton.classList.remove('restart');
    }
  } else if (gameStatus === 'playing') {
    if (mainButton) {
      mainButton.textContent = 'Restart';
      mainButton.classList.add('restart');
      mainButton.classList.remove('start');
    }
  } else if (gameStatus === 'win') {
    if (winMessage) {
      winMessage.classList.remove('hidden');
    }
  } else if (gameStatus === 'lose') {
    if (gameOverMessage) {
      gameOverMessage.classList.remove('hidden');
    }
  }
}

document.addEventListener('keydown', (e) => {
  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (arrows.includes(e.key)) {
    e.preventDefault();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  } else if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  updateUI();
});

if (mainButton) {
  mainButton.addEventListener('click', () => {
    const gameStatus = game.getStatus();

    if (gameStatus === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    updateUI();
  });
}

updateUI();
