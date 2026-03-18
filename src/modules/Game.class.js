'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;

    this.initialState = initialState || this.createEmptyBoard();
    this.board = this.cloneBoard(this.initialState);

    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this.makeMove((row) => row);
  }

  moveRight() {
    return this.makeMove((row) => row.reverse(), true);
  }

  moveUp() {
    this.transpose();

    const moved = this.makeMove((row) => row);

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();

    const moved = this.makeMove((row) => row.reverse(), true);

    this.transpose();

    return moved;
  }

  makeMove(transformRow, reverseBack = false) {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    const newBoard = this.board.map((row) => {
      let newRow = [...row];

      newRow = transformRow(newRow);

      const { row: mergedRow, moved: rowMoved } = this.mergeRow(newRow);

      if (rowMoved) {
        moved = true;
      }

      newRow = reverseBack ? mergedRow.reverse() : mergedRow;

      return newRow;
    });

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.updateStatus();
    }

    return moved;
  }

  mergeRow(row) {
    let moved = false;

    let newRow = row.filter((x) => x !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
        moved = true;
      }
    }

    newRow = newRow.filter((x) => x !== 0);

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    if (!moved && newRow.some((v, i) => v !== row[i])) {
      moved = true;
    }

    return { row: newRow, moved };
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  addRandomTile() {
    const empty = [];

    this.board.forEach((row, o) => {
      row.forEach((cell, k) => {
        if (cell === 0) {
          empty.push([o, k]);
        }
      });
    });

    if (!empty.length) {
      return;
    }

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];

    this.board[i][j] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    if (this.board.flat().includes(0)) {
      return true;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const val = this.board[i][j];

        if (this.board[i + 1]?.[j] === val || this.board[i]?.[j + 1] === val) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
