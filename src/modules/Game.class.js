'use strict';

'use strict';

export default class Game {
  constructor(initialState) {
    this.size = 4;

    this.board = initialState
      ? this.clone(initialState)
      : this.createEmptyBoard();

    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  clone(board) {
    return board.map((row) => [...row]);
  }

  getState() {
    return this.clone(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const empty = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];

    this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    return this.move((row) => row);
  }

  moveRight() {
    return this.move((row) => [...row].reverse());
  }

  moveUp() {
    this.transpose();

    const moved = this.move((row) => row);

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();

    const moved = this.move((row) => [...row].reverse());

    this.transpose();

    return moved;
  }

  move(transform) {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let i = 0; i < this.size; i += 1) {
      const originalRow = this.board[i];

      const row = transform([...originalRow]);

      const compressed = row.filter((value) => value !== 0);

      for (let j = 0; j < compressed.length - 1; j += 1) {
        if (compressed[j] === compressed[j + 1]) {
          compressed[j] *= 2;
          this.score += compressed[j];
          compressed[j + 1] = 0;
        }
      }

      const newRow = compressed.filter((value) => value !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      const finalRow = transform(newRow);

      if (finalRow.some((value, index) => value !== originalRow[index])) {
        moved = true;
      }

      this.board[i] = finalRow;
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }

    return moved;
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.canMove()) {
      return;
    }

    this.status = 'lose';
  }

  canMove() {
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}
