'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'playing';
    this.board = initialState || this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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

  start() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowThree = 0; rowThree < this.size; rowThree++) {
      for (let colThree = 0; colThree < this.size; colThree++) {
        if (this.board[rowThree][colThree] === 0) {
          emptyCells.push({ rowThree, colThree });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { rowThree: r, colThree: c } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    const newBoard = this.board.map((row) => {
      const newRow = row.filter((val) => val !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      const compressed = newRow.filter((val) => val !== 0);

      while (compressed.length < this.size) {
        compressed.push(0);
      }

      if (!moved && compressed.some((v, i) => v !== row[i])) {
        moved = true;
      }

      return compressed;
    });

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.status = 'won';
    } else if (this.checkLose()) {
      this.status = 'lost';
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row.slice().reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.slice().reverse());
  }

  moveUp() {
    this.board = this.rotateCounterClockwise(this.board);
    this.moveLeft();
    this.board = this.rotateClockwise(this.board);
  }

  moveDown() {
    this.board = this.rotateClockwise(this.board);
    this.moveLeft();
    this.board = this.rotateCounterClockwise(this.board);
  }

  rotateClockwise(board) {
    const newBoard = this.createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newBoard[c][this.size - 1 - r] = board[r][c];
      }
    }

    return newBoard;
  }

  rotateCounterClockwise(board) {
    const newBoard = this.createEmptyBoard();

    for (let rowTwo = 0; rowTwo < this.size; rowTwo++) {
      for (let colTwo = 0; colTwo < this.size; colTwo++) {
        newBoard[this.size - 1 - colTwo][rowTwo] = board[rowTwo][colTwo];
      }
    }

    return newBoard;
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const val = this.board[row][col];

        if (col < this.size - 1 && this.board[row][col + 1] === val) {
          return false;
        }

        if (row < this.size - 1 && this.board[row + 1][col] === val) {
          return false;
        }
      }
    }

    return true;
  }
}

// --- UI ---

const game = new Game();
const startButton = document.querySelector('.button');

function renderBoard(currentGame) {
  const state = currentGame.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  document.querySelector('.game-score').textContent = currentGame.getScore();

  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const gameStatus = currentGame.getStatus();

  startMessage?.classList.add('hidden');
  winMessage?.classList.toggle('hidden', gameStatus !== 'won');
  loseMessage?.classList.toggle('hidden', gameStatus !== 'lost');
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const key = e.key;

  switch (key) {
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

  renderBoard(game);
});

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
  }

  renderBoard(game);
});
