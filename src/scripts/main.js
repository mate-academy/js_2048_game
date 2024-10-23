'use strict';

import Game from './../modules/Game.class';

const game = new Game();
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const gameBoardElement = document.getElementById('game-board');

function updateScore(score) {
  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = `${score}`;
}

function renderBoard(board) {
  gameBoardElement.innerHTML = '';

  board.forEach((row) => {
    const rowElement = document.createElement('tr');

    rowElement.classList.add('row');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');

      cellElement.classList.add('cell');
      cellElement.textContent = cell !== 0 ? cell : '';
      rowElement.appendChild(cellElement);
    });

    gameBoardElement.appendChild(rowElement);
  });

  updateTileStyles(board);
}

function updateTileStyles(board) {
  const cells = document.querySelectorAll('.cell');

  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = cells[rowIndex * 4 + colIndex];

      cell.className = 'cell';

      if (value > 0) {
        cell.classList.add(`cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });
  });
}

function updateMessage(s) {
  const loseMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');
  const startMessage = document.querySelector('.message-start');

  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  if (s === 'win') {
    winMessage.classList.remove('hidden');
  } else if (s === 'lose') {
    loseMessage.classList.remove('hidden');
  } else if (s === 'start') {
    startMessage.classList.remove('hidden');
  }
}

function moveHandler() {
  renderBoard(game.getState());
  scoreDisplay.textContent = game.getScore();

  if (game.checkWin()) {
    updateMessage('win');
    document.removeEventListener('keydown', handleKeyDown);
  } else if (!game.hasValidMoves()) {
    updateMessage('lose');
    document.removeEventListener('keydown', handleKeyDown);
  }
}

function handleKeyDown(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
  }
  moveHandler();
}

document.addEventListener('DOMContentLoaded', () => {
  if (startButton) {
    startButton.addEventListener('click', startGame);
  }

  renderBoard(game.getState());
});

function startGame() {
  game.start();
  renderBoard(game.getState());
  scoreDisplay.textContent = game.getScore();
  updateMessage('start');
  updateScore(0);

  const startMessage = document.querySelector('.message-start');

  startMessage.classList.add('hidden');

  startButton.textContent = 'Restart';
  startButton.removeEventListener('click', startGame);
  startButton.addEventListener('click', restartGame);

  const button = document.querySelector('.button.start');

  if (button) {
    button.classList.remove('start');
    button.classList.add('restart');
  }

  document.addEventListener('keydown', handleKeyDown);
}

function restartGame() {
  game.reset();
  renderBoard(game.getState());
  scoreDisplay.textContent = game.getScore();
  updateMessage('start');
  startButton.textContent = 'Start';

  startButton.removeEventListener('click', restartGame);
  startButton.addEventListener('click', startGame);

  const button = document.querySelector('.button.restart');

  if (button) {
    button.classList.remove('restart');
    button.classList.add('start');
  }

  document.addEventListener('keydown', handleKeyDown);
}
