'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const actionButton = document.querySelector('.button.start');

  if (actionButton) {
    actionButton.addEventListener('click', () => {
      if (actionButton.classList.contains('start')) {
        game.start();
        createGameBoard();
        actionButton.classList.remove('start');
        actionButton.classList.add('restart');
        actionButton.textContent = 'Restart';
      } else if (actionButton.classList.contains('restart')) {
        game.restart();
        createGameBoard();
      }
      updateGameUI();
    });
  }
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
    case 'A':
    case 'a':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
    case 'D':
    case 'd':
      game.moveRight();
      moved = true;
      break;
    case 'ArrowUp':
    case 'W':
    case 'w':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
    case 'S':
    case 's':
      game.moveDown();
      moved = true;
      break;
    default:
  }

  if (moved) {
    updateGameUI();
  }
});

function createGameBoard() {
  const gameBoardContainer = document.querySelector('.game-board');

  gameBoardContainer.innerHTML = ''; // Clear any existing board

  const board = game.getState();

  board.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div');

    rowDiv.classList.add('board-row');

    row.forEach((cellValue, colIndex) => {
      const cellDiv = document.createElement('div');

      cellDiv.classList.add('field-cell');
      cellDiv.id = `cell-${rowIndex}-${colIndex}`;

      if (cellValue) {
        cellDiv.textContent = cellValue;
        cellDiv.classList.add(`field-cell--${cellValue}`);
      }
      rowDiv.appendChild(cellDiv);
    });

    gameBoardContainer.appendChild(rowDiv);
  });
}

function updateGameUI() {
  // Update score
  const scoreEl = document.querySelector('.game-score');

  if (scoreEl) {
    scoreEl.textContent = game.getScore();
  }

  // Update each board cell's DOM element
  const board = game.getState();

  board.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cellEl = document.getElementById(`cell-${rowIndex}-${colIndex}`);

      if (cellEl) {
        cellEl.textContent = cellValue || '';
        cellEl.className = 'field-cell'; // Reset class

        if (cellValue) {
          cellEl.classList.add(`field-cell--${cellValue}`);
        }
      }
    });
  });

  // Update win, lose, and start messages
  const loseMessageEl = document.querySelector('.message-lose');
  const winMessageEl = document.querySelector('.message-win');
  const startMessageEl = document.querySelector('.message-start');

  if (game.getStatus() === 'gameover') {
    if (loseMessageEl) {
      loseMessageEl.classList.remove('hidden');
    }

    if (winMessageEl) {
      winMessageEl.classList.add('hidden');
    }

    if (startMessageEl) {
      startMessageEl.classList.add('hidden');
    }
  } else if (game.getStatus() === 'won') {
    if (winMessageEl) {
      winMessageEl.classList.remove('hidden');
    }

    if (loseMessageEl) {
      loseMessageEl.classList.add('hidden');
    }

    if (startMessageEl) {
      startMessageEl.classList.add('hidden');
    }
  } else {
    if (loseMessageEl) {
      loseMessageEl.classList.add('hidden');
    }

    if (winMessageEl) {
      winMessageEl.classList.add('hidden');
    }

    if (startMessageEl) {
      startMessageEl.classList.remove('hidden');
    }
  }
}
