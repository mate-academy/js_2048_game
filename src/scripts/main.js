'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const startMessage = document.getElementById('start-message');
  const gameOverMessage = document.getElementById('game-over-message');
  const winMessage = document.getElementById('win-message');
  const restartButton = document.getElementById('restart-button');
  const scoreDisplay = document.getElementById('score');

  let board = [];
  let score = 0;

  function initializeBoard() {
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    addRandomNumber();
    addRandomNumber();
    updateBoard();
  }

  function addRandomNumber() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function updateBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cellValue = board[row][col];
        const cell = document.createElement('div');
        cell.className = `field-cell field-cell--${cellValue}`;
        cell.textContent = cellValue === 0 ? '' : cellValue;
        gameBoard.appendChild(cell);
      }
    }
    scoreDisplay.textContent = `Score: ${score}`;
  }


  function handleKeyPress(event) {
    const direction = event.key.replace('Arrow', '').toLowerCase();
    if (['up', 'down', 'left', 'right'].includes(direction)) {
      const moved = move(direction);
      if (moved) {
        addRandomNumber();
        updateBoard();
        if (isGameWon()) {
          winMessage.classList.remove('hidden');
        }
        if (isGameOver()) {
          gameOverMessage.classList.remove('hidden');
        }
      }
    }
  }
  
  function restartGame() {
    startMessage.classList.add('hidden');
    gameOverMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    score = 0;
    initializeBoard();
    updateBoard();
  }
  function isGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cellValue = board[row][col];

        const directions = [
          { row: -1, col: 0 },
          { row: 1, col: 0 },
          { row: 0, col: -1 },
          { row: 0, col: 1 }
        ];

        for (const dir of directions) {
          const newRow = row + dir.row;
          const newCol = col + dir.col;

          if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
            if (board[newRow][newCol] === cellValue) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }
  document.addEventListener('keydown', handleKeyPress);
  restartButton.addEventListener('click', restartGame);

  initializeBoard();
});
