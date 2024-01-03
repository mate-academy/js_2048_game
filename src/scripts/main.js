'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.button.start');
  const currentScoreElem = document.querySelector('.game-score');
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  const size = 4;
  let board = [];
  let currentScore = 0;

  button.addEventListener('click', () => {
    initializeGame();
    currentScore = 0;
    updateScore(0);
    button.classList.remove('start');
    button.classList.add('restart');
    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  });

  // const gameOverElem = document.getElementById('game-over');

  // Function to update the score
  function updateScore(value) {
    currentScore += value;
    currentScoreElem.textContent = currentScore;

    if (value >= 2048) {
      winMessage.classList.remove('hidden');
    }
  }

  // Function to initialize the game
  function initializeGame() {
    board = [...Array(size)].map(() => Array(size).fill(0));

    placeRandom();
    placeRandom();
    renderBoard();
  }

  // Function to add 2 or 4 on random free cell
  function placeRandom() {
    const emptyCells = [];

    // Find all empty cells
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({
            row: i,
            col: j,
          });
        }
      }
    }

    // if we have free slot...
    if (emptyCells.length > 0) {
      const randomEmptyCell
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      board[randomEmptyCell.row][randomEmptyCell.col]
      = Math.random() < 0.9 ? 2 : 4;

      const cell = document.querySelector(
        `[data-row="${randomEmptyCell.row}"][data-col="${
          randomEmptyCell.col}"]`);

      cell.classList.add('new-tile');
    }
  }

  // Function that displays all changes on the board
  function renderBoard() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const boardValue = board[i][j];
        const cell = document.querySelector(
          `[data-row='${i}'][data-col='${j}']`);
        const cellValue = cell.dataset.value;

        if (boardValue !== 0) {
          cell.dataset.value = boardValue;
          cell.textContent = boardValue;

          if (
            boardValue !== +cellValue
            && !cell.classList.contains('new-tile')
          ) {
            cell.classList.add('merged-tile');
          }
        } else {
          cell.dataset.value = 0;
          cell.textContent = '';
          cell.classList.remove('merged-tile', 'new-tile');
        }
      }
    }
  }

  function move(direction) {
    // console.log(direction);
    let needRender = false;

    if (direction === 'ArrowLeft') {
      for (let i = 0; i < board.length; i++) {
        const movedRow = moveLeft(board[i]);

        board[i] = movedRow;
      }
      needRender = true;
    }

    if (direction === 'ArrowRight') {
      for (let i = 0; i < board.length; i++) {
        const movedRow = moveRight(board[i]);

        board[i] = movedRow;
      }
      needRender = true;
    }

    if (direction === 'ArrowDown' || direction === 'ArrowUp') {
      for (let i = 0; i < size; i++) {
        const verticalRow = [];

        for (let j = 0; j < size; j++) {
          const element = board[j][i];

          verticalRow.push(element);
        }

        const uppedVerticalRow
          = direction === 'ArrowUp'
            ? moveLeft(verticalRow)
            : moveRight(verticalRow);

        for (let j = 0; j < uppedVerticalRow.length; j++) {
          board[j][i] = uppedVerticalRow[j];
        }
      }
      needRender = true;
    }

    if (needRender) {
      placeRandom();
      renderBoard();
      gameOverCheck();
    }

    // Emulate finish game cases
    if (direction === 'e') {
      emulateLoseGame();
      gameOverCheck();
    }

    if (direction === 'w') {
      emulateWinGame();
      gameOverCheck();
    }
  }

  function moveRight(row) {
    const noZeroRow = row.filter((cell) => cell !== 0);
    const moveRightRow = [];

    for (let i = noZeroRow.length - 1; i >= 0; i--) {
      const cell = noZeroRow[i];

      if (cell === noZeroRow[i - 1]) {
        moveRightRow.push(cell * 2);
        updateScore(cell * 2);
        i--;
      } else {
        moveRightRow.push(cell);
      }
    }
    moveRightRow.reverse();

    while (moveRightRow.length < 4) {
      moveRightRow.unshift(0);
    }

    return moveRightRow;
  }

  function moveLeft(row) {
    const noZeroRow = row.filter((cell) => cell !== 0);
    const moveLeftRow = [];

    for (let i = 0; i < noZeroRow.length; i++) {
      const cell = noZeroRow[i];

      if (cell === noZeroRow[i + 1]) {
        moveLeftRow.push(cell * 2);
        updateScore(cell * 2);
        i++;
      } else {
        moveLeftRow.push(cell);
      }
    }

    while (moveLeftRow.length < 4) {
      moveLeftRow.push(0);
    }

    return moveLeftRow;
  }

  function emulateWinGame() {
    const emulateBoard = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 0],
      [0, 1024, 1024, 4096],
    ];

    board = emulateBoard;
    renderBoard();
  }

  function emulateLoseGame() {
    const emulateBoard = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 8, 4],
      [4, 8, 2, 0],
    ];

    board = emulateBoard;
    renderBoard();
  }

  function gameOverCheck() {
    // Find empty cell
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          return;
        }
      }
    }

    // Check vertical marge
    for (let i = 0; i < size - 1; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === board[i + 1][j]) {
          return;
        }
      }
    }

    // Check horizontal marge
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 1; j++) {
        if (board[i][j] === board[i][j + 1]) {
          return;
        }
      }
    }

    // Game over baby
    loseMessage.classList.remove('hidden');
  }

  document.addEventListener('keydown', (e) => move(e.key));
});
