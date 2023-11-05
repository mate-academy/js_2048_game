'use strict';

document.addEventListener('DOMContentLoaded', function() {
  const gameTable = document.querySelector('.game-field');
  const scoreElement = document.querySelector('.game-score');
  const startButton = document.querySelector('.start');
  const messageStart = document.querySelector('.message-start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');

  const numRows = 4;
  const numCols = 4;
  let gameBoard = [];
  let score = 0;
  let gameActive = false;

  document.addEventListener('keydown', handleKeyPress);
  startButton.addEventListener('click', startGame);

  function initializeGame() {
    gameBoard = new Array(numRows).fill(null).map(
      () => new Array(numCols).fill(null)
    );
    score = 0;
    scoreElement.innerText = score;
    gameActive = false;
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    renderGameBoard();

    if (isGameOver()) {
      gameActive = false;
      messageLose.classList.remove('hidden');
    }
  }

  function startGame() {
    initializeGame();
    createRandomCell();
    createRandomCell();
    renderGameBoard();
    gameActive = true;
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  function isGameOver() {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (gameBoard[row][col] === null) {
          return false;
        }

        if (col < numCols - 1
          && gameBoard[row][col] === gameBoard[row][col + 1]) {
          return false;
        }

        if (row < numRows - 1
          && gameBoard[row][col] === gameBoard[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  function isGameWon() {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (gameBoard[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  function createRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (!gameBoard[row][col]) {
          emptyCells.push({
            row, col,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col }
        = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      gameBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function renderGameBoard() {
    gameTable.innerHTML = '';

    for (let row = 0; row < numRows; row++) {
      const rowElement = document.createElement('tr');

      for (let col = 0; col < numCols; col++) {
        const cellValue = gameBoard[row][col];
        const cellElement = document.createElement('td');

        cellElement.classList.add('field-cell');

        if (cellValue) {
          cellElement.textContent = cellValue;
          cellElement.classList.add(`field-cell--${cellValue}`);
        }
        rowElement.appendChild(cellElement);
      }
      gameTable.appendChild(rowElement);
    }
  }

  function handleKeyPress() {
    if (!gameActive) {
      return;
    }

    let moved = false;

    switch (event.key) {
      case 'ArrowLeft':
        moved = moveLeft();
        break;
      case 'ArrowRight':
        moved = moveRight();
        break;
      case 'ArrowUp':
        moved = moveUp();
        break;
      case 'ArrowDown':
        moved = moveDown();
        break;
    }

    if (moved) {
      createRandomCell();
      renderGameBoard();

      if (isGameOver()) {
        gameActive = false;
        messageLose.classList.remove('hidden');
      }
    }
  }

  function moveLeft() {
    let moved = false;

    for (let row = 0; row < numRows; row++) {
      for (let col = 1; col < numCols; col++) {
        if (gameBoard[row][col]) {
          let currentCol = col;

          while (currentCol > 0) {
            if (!gameBoard[row][currentCol - 1]) {
              gameBoard[row][currentCol - 1] = gameBoard[row][currentCol];
              gameBoard[row][currentCol] = null;
              currentCol--;
              moved = true;
            } else if (gameBoard[row][currentCol - 1]
              === gameBoard[row][currentCol]) {
              gameBoard[row][currentCol - 1] *= 2;
              score += gameBoard[row][currentCol - 1];
              gameBoard[row][currentCol] = null;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (moved) {
      scoreElement.innerText = score;

      if (isGameWon()) {
        gameActive = false;
        messageWin.classList.remove('hidden');
      }
    }

    return moved;
  }

  function moveRight() {
    let moved = false;

    for (let row = 0; row < numRows; row++) {
      for (let col = numCols - 2; col >= 0; col--) {
        if (gameBoard[row][col]) {
          let currentCol = col;

          while (currentCol < numCols - 1) {
            if (!gameBoard[row][currentCol + 1]) {
              gameBoard[row][currentCol + 1] = gameBoard[row][currentCol];
              gameBoard[row][currentCol] = null;
              currentCol++;
              moved = true;
            } else if (gameBoard[row][currentCol + 1]
              === gameBoard[row][currentCol]) {
              gameBoard[row][currentCol + 1] *= 2;
              score += gameBoard[row][currentCol + 1];
              gameBoard[row][currentCol] = null;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (moved) {
      scoreElement.innerText = score;
    }

    return moved;
  }

  function moveUp() {
    let moved = false;

    for (let col = 0; col < numCols; col++) {
      for (let row = 1; row < numRows; row++) {
        if (gameBoard[row][col]) {
          let currentRow = row;

          while (currentRow > 0) {
            if (!gameBoard[currentRow - 1][col]) {
              gameBoard[currentRow - 1][col] = gameBoard[currentRow][col];
              gameBoard[currentRow][col] = null;
              currentRow--;
              moved = true;
            } else if (gameBoard[currentRow - 1][col]
              === gameBoard[currentRow][col]) {
              gameBoard[currentRow - 1][col] *= 2;
              score += gameBoard[currentRow - 1][col];
              gameBoard[currentRow][col] = null;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (moved) {
      scoreElement.innerText = score;
    }

    return moved;
  }

  function moveDown() {
    let moved = false;

    for (let col = 0; col < numCols; col++) {
      for (let row = numRows - 2; row >= 0; row--) {
        if (gameBoard[row][col]) {
          let currentRow = row;

          while (currentRow < numRows - 1) {
            if (!gameBoard[currentRow + 1][col]) {
              gameBoard[currentRow + 1][col] = gameBoard[currentRow][col];
              gameBoard[currentRow][col] = null;
              currentRow++;
              moved = true;
            } else if (gameBoard[currentRow + 1][col]
              === gameBoard[currentRow][col]) {
              gameBoard[currentRow + 1][col] *= 2;
              score += gameBoard[currentRow + 1][col];
              gameBoard[currentRow][col] = null;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (moved) {
      scoreElement.innerText = score;
    }

    return moved;
  }

  initializeGame();
});
