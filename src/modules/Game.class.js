'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.board = initialState || this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const newCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          newCells.push([i, j]);
        }
      }
    }

    if (!newCells.length) {
      return;
    }

    const [x, y] = newCells[Math.floor(Math.random() * newCells.length)];

    function getTwoOrFour() {
      return Math.random() < 0.1 ? 4 : 2;
    }

    this.board[x][y] = getTwoOrFour();

    this.newTileCoords = [x, y];
  }

  moveAction({ transform, inverseTransform }) {
    let moved = false;
    let totalGained = 0;

    let board = transform(this.board);

    for (let i = 0; i < this.size; i++) {
      const { newRow, gainedScore } = this.mergeRowAction(board[i]);

      if (!this.arraysEqual(board[i], newRow)) {
        moved = true;
        board[i] = newRow;
        totalGained += gainedScore;
      }
    }

    if (moved) {
      board = inverseTransform(board);

      this.board = board;
      this.score += totalGained;
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.moveAction({
      transform: (board) => board,
      inverseTransform: (board) => board,
    });
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.moveAction({
      transform: (board) => this.reverseRows(board),
      inverseTransform: (board) => this.reverseRows(board),
    });
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.moveAction({
      transform: (board) => this.transpose(board),
      inverseTransform: (board) => this.transpose(board),
    });
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.moveAction({
      transform: (board) => this.reverseRows(this.transpose(board)),
      inverseTransform: (board) => this.transpose(this.reverseRows(board)),
    });
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
    this.status = 'playing';
  }

  restart() {
    this.start();
  }

  mergeRowAction(row) {
    const filtered = row.filter((value) => value !== 0);
    const merged = [];
    let gainedScore = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        merged.push(mergedValue);
        gainedScore += mergedValue;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return { newRow: merged, gainedScore };
  }

  arraysEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, idx) => value === arr2[idx])
    );
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        return true;
      }
    }

    return false;
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (
          (j + 1 < this.size && this.board[i][j] === this.board[i][j + 1]) ||
          (i + 1 < this.size && this.board[i][j] === this.board[i + 1][j])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  reverseRows(matrix) {
    return matrix.map((row) => [...row].reverse());
  }
}

module.exports = Game;
