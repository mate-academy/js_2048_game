'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const scoreField = document.querySelector('.game-score');
const restartButton = document.createElement('button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const startButton = document.querySelector('.start');

restartButton.textContent = 'Restart';
restartButton.classList.add('button', 'restart');

function renderBoard() {
  const board = game.getState();

  gameField.innerHTML = '';

  board.forEach((row) => {
    const rowElement = document.createElement('tr');

    rowElement.classList.add('field-row');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');

      cellElement.classList.add('field-cell');

      if (cell !== 0) {
        cellElement.classList.add(`field-cell--${cell.toString()}`);
        cellElement.textContent = cell;
      }

      rowElement.appendChild(cellElement);
    });

    gameField.appendChild(rowElement);
  });

  scoreField.textContent = game.score;
}

function handleKeyPress(e) {
  if (game.status !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    game.generateNewTile();
    renderBoard();
    checkGameStatus();
  }
}

function checkGameStatus() {
  if (game.isWinner()) {
    messageWin.classList.remove('hidden');
  } else if (game.isLoser()) {
    messageLose.classList.remove('hidden');
  }
}

function handleStartButton() {
  game.start();
  renderBoard();
  checkGameStatus();
  startButton.replaceWith(restartButton);

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
}

function handleRestartButton() {
  game.restart();
  renderBoard();
  checkGameStatus();
}

document.addEventListener('keydown', handleKeyPress);
startButton.addEventListener('click', handleStartButton);
restartButton.addEventListener('click', handleRestartButton);
