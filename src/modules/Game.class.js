'use strict';

function deepClone(arr) {
  return arr.map((item) => (Array.isArray(item) ? deepClone(item) : item));
}

class Game {
  constructor(
    initialState = Array.from({ length: 4 }, () => Array(4).fill(0)),
  ) {
    this.initialBoard = deepClone(initialState);
    this.emptyBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.board = deepClone(this.initialBoard);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return deepClone(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    let hasEmpty = false;
    let hasMoves = false;

    if (this.status === 'idle') {
      return 'idle';
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          return 'win';
        }

        if (this.board[row][col] === 0) {
          hasEmpty = true;
        }

        if (
          (col < 3 && this.board[row][col] === this.board[row][col + 1]) ||
          (row < 3 && this.board[row][col] === this.board[row + 1][col])
        ) {
          hasMoves = true;
        }
      }
    }

    if (hasEmpty || hasMoves) {
      return 'playing';
    }

    return 'lose';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row: emptyRow, col: emptyCol } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[emptyRow][emptyCol] = Math.random() < 0.9 ? 2 : 4;
  }

  shiftTiles(rowOrCol, direction) {
    const filtered = rowOrCol.filter((num) => num !== 0);

    while (filtered.length < 4) {
      if (direction === 'left' || direction === 'up') {
        filtered.push(0);
      } else {
        filtered.unshift(0);
      }
    }

    return filtered;
  }

  combineTiles(rowOrCol) {
    for (let i = 0; i < rowOrCol.length - 1; i++) {
      if (rowOrCol[i] === rowOrCol[i + 1] && rowOrCol[i] !== 0) {
        rowOrCol[i] *= 2;
        this.score += rowOrCol[i];
        rowOrCol[i + 1] = 0;
      }
    }

    return rowOrCol.filter((num) => num !== 0);
  }

  moveLeft() {
    if (this.status === 'idle') {
      return;
    }

    let changed = false;

    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row];

      newRow = this.combineTiles(this.shiftTiles(newRow, 'left'));
      newRow = this.shiftTiles(newRow, 'left');

      if (this.board[row].join() !== newRow.join()) {
        changed = true;
      }
      this.board[row] = newRow;
    }

    if (changed) {
      this.addRandomTile();
    }
  }

  moveRight() {
    if (this.status === 'idle') {
      return;
    }

    let changed = false;

    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row];

      newRow = this.combineTiles(this.shiftTiles(newRow, 'right'));
      newRow = this.shiftTiles(newRow, 'right');

      if (this.board[row].join() !== newRow.join()) {
        changed = true;
      }
      this.board[row] = newRow;
    }

    if (changed) {
      this.addRandomTile();
    }
  }

  moveUp() {
    if (this.status === 'idle') {
      return;
    }

    let changed = false;

    for (let col = 0; col < 4; col++) {
      let newCol = this.board.map((row) => row[col]);

      newCol = this.combineTiles(this.shiftTiles(newCol, 'up'));
      newCol = this.shiftTiles(newCol, 'up');

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          changed = true;
        }
        this.board[row][col] = newCol[row];
      }
    }

    if (changed) {
      this.addRandomTile();
    }
  }

  moveDown() {
    if (this.status === 'idle') {
      return;
    }

    let changed = false;

    for (let col = 0; col < 4; col++) {
      let newCol = this.board.map((row) => row[col]);

      newCol = this.combineTiles(this.shiftTiles(newCol, 'down'));
      newCol = this.shiftTiles(newCol, 'down');

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          changed = true;
        }
        this.board[row][col] = newCol[row];
      }
    }

    if (changed) {
      this.addRandomTile();
    }
  }

  start() {
    this.board = deepClone(this.initialBoard);
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = deepClone(this.initialBoard);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
