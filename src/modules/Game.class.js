'use strict';

export default class Game {
  constructor(initialState) {
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const source = initialState || defaultState;

    this.initialState = source.map((row) => row.slice());
    this.board = source.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const old = this.getState();

    this.board = this.board.map((row) => this.moveRowLeft(row));

    if (!this.areBoardsEqual(old, this.board)) {
      this.addRandomTitel();
    }
    this.ifCheckGameOver();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const old = this.getState();

    this.board = this.board.map((row) => {
      const reversed = row.slice().reverse();
      const moved = this.moveRowLeft(reversed);

      return moved.reverse();
    });

    if (!this.areBoardsEqual(old, this.board)) {
      this.addRandomTitel();
    }

    this.ifCheckGameOver();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const old = this.getState();
    let t = this.transpose(this.board);

    t = t.map((row) => this.moveRowLeft(row));
    this.board = this.transpose(t);

    if (!this.areBoardsEqual(old, this.board)) {
      this.addRandomTitel();
    }

    this.ifCheckGameOver();
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const old = this.getState();
    let t = this.transpose(this.board);

    t = t.map((row) => {
      const reversed = row.slice().reverse();
      const moved = this.moveRowLeft(reversed);

      return moved.reverse();
    });
    this.board = this.transpose(t);

    if (!this.areBoardsEqual(old, this.board)) {
      this.addRandomTitel();
    }

    this.ifCheckGameOver();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((r) => r.slice());
  }

  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
    }

    if (this.isBoardEmpty()) {
      this.addRandomTitel();
      this.addRandomTitel();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((r) => r.slice());
    this.score = 0;
    this.status = 'idle';
  }

  isBoardEmpty() {
    return this.board.every((row) => row.every((cell) => cell === 0));
  }

  addRandomTitel() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  compress(row) {
    return row.filter((v) => v !== 0);
  }
  merge(row) {
    const arr = row.filter((v) => v !== 0);

    // 2 — злиття
    const merged = [];
    let i = 0;

    while (i < arr.length) {
      if (arr[i] === arr[i + 1]) {
        const sum = arr[i] * 2;

        merged.push(sum);
        this.score += sum;
        i += 2;
      } else {
        merged.push(arr[i]);
        i++;
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  moveRowLeft(row) {
    const compressed = this.compress(row);
    const merge = this.merge(compressed);
    const final = this.compress(merge);

    while (final.length < 4) {
      final.push(0);
    }

    return final;
  }

  ifCheckGameOver() {
    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return;
        }
      }
    }

    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }
  areBoardsEqual(a, b) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }
  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((r) => r[i]));
  }
}

module.exports = Game;
