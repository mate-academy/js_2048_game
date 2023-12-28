'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.field-cell');
  const startButton = document.querySelector('.button.start');
  const scoreDisplay = document.querySelector('.game-score');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  let score = 0;
  let board = [];
  let gameOver = false;

  function startGame() {
    board = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
    gameOver = false;
    score = 0;
    updateScore();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.add('hidden');

    generateNumber();
    generateNumber();
    updateBoard();
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  }

  function updateBoard() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = cells[i * 4 + j];
        const value = board[i][j];

        cell.textContent = value !== 0 ? value : '';
        cell.className = `field-cell field-cell--${value}`;
      }
    }
  }

  function generateNumber() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({
            row: i, col: j,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col }
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function updateScore() {
    scoreDisplay.textContent = score;
  }

  function move(direction) {
    if (gameOver) {
      return;
    }

    let moved = false;

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
          if (board[i][j] !== 0) {
            let k = j - 1;

            while (k >= 0 && board[i][k] === 0) {
              board[i][k] = board[i][k + 1];
              board[i][k + 1] = 0;
              k--;
              moved = true;
            }

            if (k >= 0 && board[i][k] === board[i][k + 1]) {
              board[i][k] *= 2;
              score += board[i][k];
              board[i][k + 1] = 0;
              moved = true;
            }
          }
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
          if (board[i][j] !== 0) {
            let k = j + 1;

            while (k < 4 && board[i][k] === 0) {
              board[i][k] = board[i][k - 1];
              board[i][k - 1] = 0;
              k++;
              moved = true;
            }

            if (k < 4 && board[i][k] === board[i][k - 1]) {
              board[i][k] *= 2;
              score += board[i][k];
              board[i][k - 1] = 0;
              moved = true;
            }
          }
        }
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
          if (board[i][j] !== 0) {
            let k = i - 1;

            while (k >= 0 && board[k][j] === 0) {
              board[k][j] = board[k + 1][j];
              board[k + 1][j] = 0;
              k--;
              moved = true;
            }

            if (k >= 0 && board[k][j] === board[k + 1][j]) {
              board[k][j] *= 2;
              score += board[k][j];
              board[k + 1][j] = 0;
              moved = true;
            }
          }
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
          if (board[i][j] !== 0) {
            let k = i + 1;

            while (k < 4 && board[k][j] === 0) {
              board[k][j] = board[k - 1][j];
              board[k - 1][j] = 0;
              k++;
              moved = true;
            }

            if (k < 4 && board[k][j] === board[k - 1][j]) {
              board[k][j] *= 2;
              score += board[k][j];
              board[k - 1][j] = 0;
              moved = true;
            }
          }
        }
      }
    }

    if (moved) {
      generateNumber();
      updateBoard();

      if (checkWin()) {
        winMessage.classList.remove('hidden');
        gameOver = true;
      }

      if (!checkAvailableMoves()) {
        loseMessage.classList.remove('hidden');
        gameOver = true;
      }

      updateScore();
      startButton.textContent = 'Restart';
    }
  }

  function checkAvailableMoves() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          return true;
        }

        if (i > 0 && board[i][j] === board[i - 1][j]) {
          return true;
        }

        if (i < 3 && board[i][j] === board[i + 1][j]) {
          return true;
        }

        if (j > 0 && board[i][j] === board[i][j - 1]) {
          return true;
        }

        if (j < 3 && board[i][j] === board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  function checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  document.addEventListener('keydown', (evnt) => {
    if (evnt.key === 'ArrowLeft') {
      move('left');
    } else if (evnt.key === 'ArrowRight') {
      move('right');
    } else if (evnt.key === 'ArrowUp') {
      move('up');
    } else if (evnt.key === 'ArrowDown') {
      move('down');
    }
  });

  startButton.addEventListener('click', startGame);
});
