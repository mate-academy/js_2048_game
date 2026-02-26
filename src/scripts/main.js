'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

const MAX_ROW_COL_LENGTH = 3;

class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.board[rowIndex][colIndex] === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    startBtn.hidden = true;
    restartBtn.hidden = false;

    msgStart.hidden = true;

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    if (this.status === 'idle') {
      return;
    }

    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  moveLeft() {
    let moved = false;

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      const row = this.board[rowIndex];
      const newRow = this.processRowLeft(row);

      if (row.join() !== newRow.join()) {
        moved = true;
      }

      this.board[rowIndex] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  processRowLeft(row) {
    let newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    newRow = newRow.filter((val) => val !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  moveRight() {
    let moved = false;

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      const row = this.board[rowIndex];

      const reversed = row.slice().reverse();
      const processed = this.processRowLeft(reversed);
      const finalRow = processed.reverse();

      if (row.join() !== finalRow.join()) {
        moved = true;
      }

      this.board[rowIndex] = finalRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();

    this.checkStatus();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();

    this.checkStatus();
  }

  transpose() {
    const newBoard = [];

    for (let colIndex = 0; colIndex < 4; colIndex++) {
      newBoard[colIndex] = [];

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        newBoard[colIndex][rowIndex] = this.board[rowIndex][colIndex];
      }
    }

    this.board = newBoard;
  }

  checkWin() {
    if (this.board.flat().some((cell) => cell >= 2048)) {
      this.status = 'win';

      return true;
    }

    return false;
  }

  checkGameOver() {
    if (this.board.flat().some((cell) => cell === 0)) {
      return false;
    }

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (
          colIndex < MAX_ROW_COL_LENGTH &&
          this.board[rowIndex][colIndex] === this.board[rowIndex][colIndex + 1]
        ) {
          return false;
        }

        if (
          rowIndex < MAX_ROW_COL_LENGTH &&
          this.board[rowIndex][colIndex] === this.board[rowIndex + 1][colIndex]
        ) {
          return false;
        }
      }
    }

    this.status = 'gameover';

    return true;
  }

  checkStatus() {
    if (this.checkWin()) {
      return;
    }

    this.checkGameOver();
  }
}

const game = new Game();

const boardEl = document.querySelector('.game-field tbody');
const scoreEl = document.querySelector('.game-score');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const msgStart = document.querySelector('.message-start');
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');

restartBtn.hidden = true;

function renderBoard() {
  const state = game.getState();
  const rows = boardEl.querySelectorAll('tr');

  rows.forEach((tr, rowIndex) => {
    const cells = tr.querySelectorAll('td');

    cells.forEach((td, colIndex) => {
      td.textContent =
        state[rowIndex][colIndex] === 0 ? '' : state[rowIndex][colIndex];
      td.className = 'field-cell';

      if (state[rowIndex][colIndex] > 0) {
        td.classList.add(`field-cell--${state[rowIndex][colIndex]}`);
      }
    });
  });

  scoreEl.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    msgWin.classList.remove('hidden');
    msgLose.classList.add('hidden');
    msgStart.classList.add('hidden');
  } else if (game.getStatus() === 'gameover') {
    msgLose.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgStart.classList.add('hidden');
  } else {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
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
    default:
      return;
  }
  renderBoard();
});

startBtn.addEventListener('click', () => {
  game.start();
  renderBoard();
});

restartBtn.addEventListener('click', () => {
  game.restart();
  renderBoard();
});

renderBoard();
