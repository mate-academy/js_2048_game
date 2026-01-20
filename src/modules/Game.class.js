'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    if (initialState && initialState.length === this.size) {
      this.state = initialState.map((row) => [...row]);
    } else {
      this.state = this.createEmptyBoard();
    }

    this.initialBoard = this.state.map((row) => [...row]);
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getState() {
    return this.state.map((row) => [...row]);
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
    this.state = this.initialBoard.map((row) => [...row]);
    this.score = 0;

    this.spawnNewCell();
    this.spawnNewCell();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.state = this.initialBoard.map((row) => [...row]);
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    switch (direction) {
      case 'left':
        this.state = this.state.map((row) => {
          const newRow = this.processRowLeft(row);

          if (!moved && !this.rowsEqual(row, newRow)) {
            moved = true;
          }

          return newRow;
        });
        break;

      case 'right':
        this.state = this.state.map((row) => {
          const newRow = this.processRowRight(row);

          if (!moved && !this.rowsEqual(row, newRow)) {
            moved = true;
          }

          return newRow;
        });
        break;

      case 'up': {
        const t = this.transpose(this.state);

        const merged = t.map((row) => {
          const newRow = this.processRowLeft(row);

          if (!moved && !this.rowsEqual(row, newRow)) {
            moved = true;
          }

          return newRow;
        });

        this.state = this.transpose(merged);
        break;
      }

      case 'down': {
        const t = this.transpose(this.state);

        const merged = t.map((row) => {
          const newRow = this.processRowRight(row);

          if (!moved && !this.rowsEqual(row, newRow)) {
            moved = true;
          }

          return newRow;
        });

        this.state = this.transpose(merged);
        break;
      }

      default:
        return false;
    }

    if (moved) {
      this.spawnNewCell();
      this.updateStatus();
    }

    return moved;
  }

  rowsEqual(a, b) {
    for (let i = 0; i < this.size; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  processRowRight(row) {
    let nums = row.filter((n) => n > 0);

    for (let i = nums.length - 1; i > 0; i--) {
      if (nums[i] === nums[i - 1]) {
        nums[i] *= 2;
        this.score += nums[i];
        nums[i - 1] = 0;
        i--;
      }
    }

    nums = nums.filter((n) => n > 0);

    while (nums.length < this.size) {
      nums.unshift(0);
    }

    return nums;
  }

  processRowLeft(row) {
    const reversed = [...row].reverse();
    const processed = this.processRowRight(reversed);

    return processed.reverse();
  }

  spawnNewCell() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose(matrix) {
    const result = this.createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        result[i][j] = matrix[j][i];
      }
    }

    return result;
  }

  updateStatus() {
    // win
    for (const row of this.state) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // still have empty cells → playing
    for (const row of this.state) {
      for (const cell of row) {
        if (cell === 0) {
          return;
        }
      }
    }

    // check horizontal moves
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return;
        }
      }
    }

    // check vertical moves
    for (let i = 0; i < this.size - 1; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

// CommonJS for tests
module.exports = Game;

// Browser global
if (typeof window !== 'undefined') {
  window.Game = Game;
}
