'use strict';
class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = initialState.map((row) => row.slice());
    } else {
      this.board = Array.from({ length: this.size }, () => {
        return Array(this.size).fill(0);
      });
    }
  }

  getState() {
    return this.board.map((row) => row.slice());
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
    this.score = 0;
    this.status = 'idle';

    this.board = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });
    this.start();
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const row = this.board[r].filter((v) => v !== 0);
      const newRow = [];

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          const merged = row[i] * 2;

          newRow.push(merged);
          this.score += merged;
          i++;
        } else {
          newRow.push(row[i]);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (!this.arraysEqual(newRow, this.board[r])) {
        this.board[r] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const row = this.board[r].filter((v) => v !== 0).reverse();
      const newRow = [];

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          const merged = row[i] * 2;

          newRow.push(merged);
          this.score += merged;
          i++;
        } else {
          newRow.push(row[i]);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      newRow.reverse();

      if (!this.arraysEqual(newRow, this.board[r])) {
        this.board[r] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = [];

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== 0) {
          col.push(this.board[r][c]);
        }
      }

      const newCol = [];

      for (let i = 0; i < col.length; i++) {
        if (col[i] === col[i + 1]) {
          const merged = col[i] * 2;

          newCol.push(merged);
          this.score += merged;
          i++;
        } else {
          newCol.push(col[i]);
        }
      }

      while (newCol.length < this.size) {
        newCol.push(0);
      }

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          this.board[r][c] = newCol[r];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = [];

      for (let r = this.size - 1; r >= 0; r--) {
        if (this.board[r][c] !== 0) {
          col.push(this.board[r][c]);
        }
      }

      const newCol = [];

      for (let i = 0; i < col.length; i++) {
        if (col[i] === col[i + 1]) {
          const merged = col[i] * 2;

          newCol.push(merged);
          this.score += merged;
          i++;
        } else {
          newCol.push(col[i]);
        }
      }

      while (newCol.length < this.size) {
        newCol.push(0);
      }

      newCol.reverse();

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          this.board[r][c] = newCol[r];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  updateStatus() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          this.status = 'playing';

          return;
        }

        if (
          (r + 1 < this.size && this.board[r][c] === this.board[r + 1][c]) ||
          (c + 1 < this.size && this.board[r][c] === this.board[r][c + 1])
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }
}

module.exports = Game;
