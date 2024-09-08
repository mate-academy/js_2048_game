'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const scoreDisplay = document.querySelector('.game-score');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');
  const startButton = document.querySelector('.button.start');

  const grid = [];
  let score = 0;

  function createBoard() {
    for (let i = 0; i < 4; i++) {
      grid[i] = [];

      for (let j = 0; j < 4; j++) {
        grid[i][j] = 0;
      }
    }
    addNumber();
    addNumber();
    updateBoard();
  }

  function updateBoard() {
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;

      cell.textContent = grid[row][col] === 0 ? '' : grid[row][col];
      cell.className = 'field-cell';

      if (grid[row][col] !== 0) {
        cell.classList.add('field-cell--' + grid[row][col]);
      }
    });
    scoreDisplay.textContent = score;
  }

  function addNumber() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({
            row: i, col: j,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell
        = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function move(rowDirection, colDirection) {
    let moved = false;
    const merged = [];

    for (let i = 0; i < 4; i++) {
      merged[i] = [false, false, false, false];
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const row = rowDirection === 1 ? 3 - i : i;
        const col = colDirection === 1 ? 3 - j : j;

        if (grid[row][col] !== 0) {
          let newRow = row;
          let newCol = col;

          while (
            newRow + rowDirection >= 0
            && newRow + rowDirection < 4
            && newCol + colDirection >= 0
            && newCol + colDirection < 4
            && grid[newRow + rowDirection][newCol + colDirection] === 0
          ) {
            newRow += rowDirection;
            newCol += colDirection;
          }

          if (
            newRow + rowDirection >= 0
            && newRow + rowDirection < 4
            && newCol + colDirection >= 0
            && newCol + colDirection < 4
            && grid[newRow + rowDirection][newCol + colDirection]
            === grid[row][col]
            && !merged[newRow + rowDirection][newCol + colDirection]
          ) {
            newRow += rowDirection;
            newCol += colDirection;
            grid[newRow][newCol] *= 2;
            grid[row][col] = 0;
            score += grid[newRow][newCol];
            merged[newRow][newCol] = true;
            moved = true;

            if (grid[newRow][newCol] === 2048) {
              messageWin.classList.remove('hidden');
            }
          } else if (newRow !== row || newCol !== col) {
            grid[newRow][newCol] = grid[row][col];
            grid[row][col] = 0;
            moved = true;
          }
        }
      }
    }

    if (moved) {
      addNumber();
      updateBoard();
      checkGameOver();
    }
  }

  function checkGameOver() {
    let hasMoves = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          hasMoves = true;
        }

        if (
          (i > 0 && grid[i][j] === grid[i - 1][j])
          || (i < 3 && grid[i][j] === grid[i + 1][j])
          || (j > 0 && grid[i][j] === grid[i][j - 1])
          || (j < 3 && grid[i][j] === grid[i][j + 1])
        ) {
          hasMoves = true;
        }
      }
    }

    if (!hasMoves) {
      messageLose.classList.remove('hidden');
    }
  }

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        move(-1, 0);
        break;
      case 'ArrowDown':
        move(1, 0);
        break;
      case 'ArrowLeft':
        move(0, -1);
        break;
      case 'ArrowRight':
        move(0, 1);
        break;
    }
  });

  startButton.addEventListener('click', () => {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
    score = 0;
    createBoard();

    startButton.textContent = 'Restart';
    startButton.classList.remove('Start');
    startButton.classList.add('restart');
  });
});
