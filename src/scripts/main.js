'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

document.addEventListener('keydown', handleKeyPress);

restartButton.style.display = 'none';

startButton.addEventListener('click', () => {
  initializeGame();
});

function initializeGame() {
  game.start();
  clearGameField();
  refreshTable(game.board);
  updateGameField(game.board);

  startButton.style.display = 'none';
  restartButton.style.display = 'block';
}

function clearGameField() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell) => {
    cell.textContent = '';
  });
}

restartButton.addEventListener('click', () => {
  game.restart();
  initializeGame();
  document.addEventListener('keydown', handleKeyPress);
});

function updateGameField(board) {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const value = board[Math.floor(index / 4)][index % 4];

    cell.textContent = value === 0 ? '' : value;
  });

  checkGameStatus();
}

function checkGameStatus() {
  const gameStatus = game.getStatus();

  if (
    gameStatus === Game.gameStatuses.win ||
    gameStatus === Game.gameStatuses.lose
  ) {
    document.removeEventListener('keydown', handleKeyPress);
  }
}

function handleKeyPress(e) {
  const moveActions = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const action = moveActions[e.key];

  if (action) {
    action();
    checkGameStatusAfterMove();
  }
}

function checkGameStatusAfterMove() {
  if (game.checkWin()) {
    checkGameStatus(Game.gameStatuses.win);
  } else if (game.checkLose()) {
    checkGameStatus(Game.gameStatuses.lose);
  }

  refreshTable(game.board);
  updateGameField(game.board);
}

function refreshTable(initialState) {
  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((row, rowIndex) => {
    const columns = row.children;

    Array.from(columns).forEach((cell, columnIndex) => {
      const stateCell = initialState[rowIndex][columnIndex];

      cell.className = 'field-cell field-cell--' + stateCell;
      cell.innerText = stateCell > 0 ? stateCell : '';
    });
  });
}
