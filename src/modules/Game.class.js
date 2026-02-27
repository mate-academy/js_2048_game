'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    if (initialState) {
      this.state = initialState.map((row) => [...row]);
    } else {
      this.state = Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    }

    this.score = 0;
    this.status = 'idle';
    this.initialStateTemplate = this.state.map((row) => [...row]);
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

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [row, col] = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = value;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  compressRow(row) {
    const filtered = row.filter((v) => v !== 0);

    const merged = [];
    let points = 0;

    let i = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;

        merged.push(value);
        points += value;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i += 1;
      }
    }

    while (merged.length < row.length) {
      merged.push(0);
    }

    const changed = row.some((v, idx) => v !== merged[idx]);

    return { newRow: merged, points, changed };
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    this.state.forEach((row, index) => {
      const { newRow, points, changed } = this.compressRow(row);

      this.state[index] = newRow;
      this.score += points;

      if (changed) {
        moved = true;
      }
    });

    if (moved) {
      this.addRandomTile();
      this.updateStatusAfterMove();
    }
  }

  restart() {
    this.state = this.initialStateTemplate.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    this.state.forEach((row, index) => {
      const originalRow = row.slice();

      const reversed = originalRow.slice().reverse();
      const { newRow, points } = this.compressRow(reversed);
      const finalRow = newRow.slice().reverse();

      this.state[index] = finalRow;
      this.score += points;

      for (let i = 0; i < 4; i++) {
        if (originalRow[i] !== finalRow[i]) {
          moved = true;
          break;
        }
      }
    });

    if (moved) {
      this.addRandomTile();
      this.updateStatusAfterMove();
    }
  }

  getColumn(colIndex) {
    const arr = [];

    for (let i = 0; i < 4; i++) {
      arr.push(this.state[i][colIndex]);
    }

    return arr;
  }

  setColumn(colIndex, newCol) {
    for (let i = 0; i < 4; i++) {
      this.state[i][colIndex] = newCol[i];
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = this.getColumn(col);
      const { newRow, points } = this.compressRow(column);

      this.setColumn(col, newRow);
      this.score += points;

      for (let i = 0; i < 4; i++) {
        if (column[i] !== newRow[i]) {
          moved = true;

          break;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatusAfterMove();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = this.getColumn(col);

      const reversed = column.slice().reverse();
      const { newRow, points } = this.compressRow(reversed);

      const finalCol = newRow.slice().reverse();

      this.setColumn(col, finalCol);
      this.score += points;

      for (let i = 0; i < 4; i++) {
        if (column[i] !== finalCol[i]) {
          moved = true;

          break;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatusAfterMove();
    }
  }

  has2048() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatusAfterMove() {
    if (this.has2048()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }
}

module.exports = Game;
