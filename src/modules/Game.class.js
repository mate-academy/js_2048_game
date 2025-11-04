'use strict';
class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'playing';

    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();

    if (!initialState) {
      this.addRandomNumber();
      this.addRandomNumber();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  move(rows) {
    let moved = false;

    for (const row of rows) {
      const original = row.slice();
      const merged = this.merge(row);

      if (!this.arraysEquel(original, merged)) {
        moved = true;
      }

      row.splice(0, row.length, ...merged);
    }

    return moved;
  }

  merge(row) {
    const nZero = row.filter((n) => n !== 0);
    const merged = [];

    for (let i = 0; i < nZero.length; i++) {
      if (nZero[i] === nZero[i + 1]) {
        merged.push(nZero[i] * 2);
        this.score += nZero[i] * 2;
        i++;
      } else {
        merged.push(nZero[i]);
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  moveLeft() {
    const moved = this.move(this.board);

    if (moved) {
      this.addRandomNumber();
      this.updateStatus();
    }
  }

  moveRight() {
    const reversed = this.board.map((row) => row.slice().reverse());
    const moved = this.move(reversed);

    if (moved) {
      this.board = reversed.map((row) => row.slice().reverse());
      this.addRandomNumber();
      this.updateStatus();
    }
  }

  moveUp() {
    const transponsed = this.transpose(this.board);
    const moved = this.move(transponsed);

    if (moved) {
      this.board = this.transpose(transponsed);
      this.addRandomNumber();
      this.updateStatus();
    }
  }

  moveDown() {
    const transposedReversed = this.transpose(this.board).map((row) => {
      return row.slice().reverse();
    });

    const moved = this.move(transposedReversed);

    if (moved) {
      this.board = this.transpose(
        transposedReversed.map((row) => row.slice().reverse()),
      );

      this.addRandomNumber();
      this.updateStatus();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomNumber();
    this.addRandomNumber();

    let placed = false;

    while (!placed) {
      const num = [];

      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (this.board[row][col]) {
            num.push([row, col]);
          }
        }
      }

      const [rowNext, colNext] = num[Math.floor(Math.random() * num.length)];

      const neighbors = [
        [rowNext - 1, colNext],
        [rowNext + 1, colNext],
        [rowNext, colNext - 1],
        [rowNext, colNext + 1],
      ];

      const isNeighborsOccupied = neighbors.some(
        ([row, col]) =>
          row >= 0 &&
          row <= this.size &&
          col >= 0 &&
          col <= this.size &&
          this.board[row][col] !== 0,
      );

      if (!isNeighborsOccupied) {
        this.board[rowNext][colNext] = Math.random() < 0.9 ? 2 : 4;
        placed = true;
      }
    }
  }

  addRandomNumber() {
    const num = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          num.push([i, j]);
        }
      }
    }

    if (num.length === 0) {
      return;
    }

    const [row, col] = num[Math.floor(Math.random() * num.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  arraysEquel(a, b) {
    return a.length === b.length && a.every((curr, next) => curr === b[next]);
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.board[row][col];

        if (
          (row < this.size - 1 && this.board[row + 1][col] === value) ||
          (col < this.size - 1 && this.board[row][col + 1] === value)
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
