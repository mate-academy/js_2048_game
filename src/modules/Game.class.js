'use strict';
class Game {
  constructor(initialState) {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  boardsAreEqual(board1, board2) {
    for (let i = 0; i < board1.length; i++) {
      for (let j = 0; j < board1[i].length; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    const oldBoard = this.board.map((row) => [...row]);
    const merged = new Set();

    for (let i = 0; i < this.board.length; i++) {
      for (let b = 0; b < this.board[i].length; b++) {
        if (this.board[i][b - 1] !== undefined) {
          let pos = b;

          if (this.board[i][pos] !== 0) {
            while (pos > 0 && this.board[i][pos - 1] === 0) {
              this.board[i][pos - 1] = this.board[i][pos];
              this.board[i][pos] = 0;
              pos--;
            }

            const key = `${i}-${pos - 1}`;

            if (
              pos !== 0 &&
              this.board[i][pos - 1] === this.board[i][pos] &&
              !merged.has(key)
            ) {
              const calc = this.board[i][pos - 1] + this.board[i][pos];

              this.score += calc;
              this.board[i][pos - 1] = calc;
              this.board[i][pos] = 0;
              merged.add(key);
            }
          }
        }
      }
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.createCell();
    }
  }

  moveRight() {
    const oldBoard = this.board.map((row) => [...row]);
    const merged = new Set();

    for (let i = 0; i < this.board.length; i++) {
      for (let b = this.board[i].length - 1; b >= 0; b--) {
        let pos = b;

        if (this.board[i][pos] !== 0) {
          while (
            this.board[i][pos + 1] !== undefined &&
            this.board[i][pos + 1] === 0
          ) {
            this.board[i][pos + 1] = this.board[i][pos];
            this.board[i][pos] = 0;
            pos++;
          }

          const key = `${i}-${pos + 1}`;

          if (
            this.board[i][pos + 1] !== undefined &&
            this.board[i][pos + 1] === this.board[i][pos] &&
            !merged.has(key)
          ) {
            const calc = this.board[i][pos + 1] + this.board[i][pos];

            this.score += calc;
            this.board[i][pos + 1] = calc;
            this.board[i][pos] = 0;
            merged.add(key);
          }
        }
      }
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.createCell();
    }
  }

  moveUp() {
    const oldBoard = this.board.map((row) => [...row]);
    const merged = new Set();

    for (let i = 0; i < this.board.length; i++) {
      for (let b = 0; b < this.board[i].length; b++) {
        if (this.board[i - 1] !== undefined) {
          let pos = i;

          if (this.board[pos][b] !== 0) {
            while (pos > 0 && this.board[pos - 1][b] === 0) {
              const ar1 = this.board[pos - 1];
              const ar2 = this.board[pos];

              ar1[b] = ar2[b];
              ar2[b] = 0;
              pos--;
            }

            const key = `${pos - 1}-${b}`;

            if (
              pos !== 0 &&
              this.board[pos - 1][b] === this.board[pos][b] &&
              !merged.has(key)
            ) {
              const calc = this.board[pos - 1][b] + this.board[pos][b];

              this.score += calc;
              this.board[pos - 1][b] = calc;
              this.board[pos][b] = 0;
              merged.add(key);
            }
          }
        }
      }
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.createCell();
    }
  }

  moveDown() {
    const oldBoard = this.board.map((row) => [...row]);
    const merged = new Set();

    for (let i = this.board.length - 1; i >= 0; i--) {
      for (let b = 0; b < this.board[i].length; b++) {
        let pos = i;

        if (this.board[pos][b] !== 0) {
          while (
            this.board[pos + 1] !== undefined &&
            this.board[pos + 1][b] === 0
          ) {
            const ar1 = this.board[pos + 1];
            const ar2 = this.board[pos];

            ar1[b] = ar2[b];
            ar2[b] = 0;
            pos++;
          }

          const key = `${pos + 1}-${b}`;

          if (
            this.board[pos + 1] !== undefined &&
            pos + 1 !== this.board.length &&
            this.board[pos + 1][b] === this.board[pos][b] &&
            !merged.has(key)
          ) {
            const calc = this.board[pos + 1][b] + this.board[pos][b];

            this.score += calc;
            this.board[pos + 1][b] = calc;
            this.board[pos][b] = 0;
            merged.add(key);
          }
        }
      }
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.createCell();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.createCell();
    this.createCell();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  createCell() {
    const empty = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  loseCheck() {
    for (let i = 0; i < this.board.length; i++) {
      for (let b = 0; b < this.board[i].length; b++) {
        const current = this.board[i][b];

        if (current === 0) {
          return false;
        }

        if (
          this.board[i][b + 1] !== undefined &&
          this.board[i][b + 1] === current
        ) {
          return false;
        }

        if (
          this.board[i + 1] !== undefined &&
          this.board[i + 1][b] === current
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
module.exports = Game;
