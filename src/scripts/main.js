'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const mainScore = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function renderGame() {
  const boardState = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = boardState[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  mainScore.textContent = game.getScore();

  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      game.start();
      renderGame();

      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';
    } else if (startButton.classList.contains('restart')) {
      game.restart();
      renderGame();
      startButton.classList.remove('restart');
      startButton.classList.add('start');
      startButton.textContent = 'Start';
    }
  });

  const gameStatus = game.getStatus();

  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
}

document.addEventListener('keydown', (gameEvent) => {
  gameEvent.preventDefault();

  let movePerfomed = false;

  switch (gameEvent.key) {
    case 'ArrowUp':
      movePerfomed = game.moveUp();
      break;

    case 'ArrowDown':
      movePerfomed = game.moveDown();
      break;

    case 'ArrowLeft':
      movePerfomed = game.moveLeft();
      break;

    case 'ArrowRight':
      movePerfomed = game.moveRight();
      break;
  }

  if (movePerfomed) {
    game.addRandomTiles();
    renderGame();
  }
});

renderGame();
