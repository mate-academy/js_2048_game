'use strict';

class Game {
  constructor(initialState = null) {
    this.field = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.status = 'start';
    this.initialState = initialState;
    this.score = 0;

    this.size = 4;

    if (initialState) {
      if (!Array.isArray(initialState) || initialState.length !== 4) {
        throw new Error('Invalid initialState');
      }

      initialState.forEach((row) => {
        if (!Array.isArray(row) || row.length !== 4) {
          throw new Error('Invalid row');
        }

        row.forEach((value) => {
          if (!Number.isInteger(value) || value < 0) {
            throw new Error('Invalid cell');
          }
        });
      });

      if (initialState) {
        this.field = initialState.map((row) => row.slice());
        this.initialState = initialState.map((row) => row.slice());
      }
    }
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.field[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];

      this.field[r][c] = Math.random() < 0.9 ? 2 : 4;

      return true;
    }

    return false;
  }

  shiftRowLeft(row) {
    let newRow = row.filter((num) => num !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    newRow = newRow.filter((num) => num !== 0);

    while (newRow.length < row.length) {
      newRow.push(0);
    }

    return newRow;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const newField = this.field.map((row) => this.shiftRowLeft(row));

    const changed = newField.some((row, i) => {
      return row.some((cell, j) => cell !== this.field[i][j]);
    });

    if (changed) {
      this.field = newField;
    }

    return changed;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const newField = this.field.map((row) => {
      const reversed = row.slice().reverse();
      const shifted = this.shiftRowLeft(reversed);

      return shifted.reverse();
    });

    const changed = newField.some((row, i) => {
      return row.some((cell, j) => cell !== this.field[i][j]);
    });

    if (changed) {
      this.field = newField;
    }

    return changed;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    this.field = this.transpose(this.field);

    const changed = this.moveLeft();

    this.field = this.transpose(this.field);

    return changed;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    this.field = this.transpose(this.field);

    const changed = this.moveRight();

    this.field = this.transpose(this.field);

    return changed;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.field;
  }

  getStatus() {
    return this.status;
  }

  hasEmptyCells() {
    return this.field.some((row) => row.some((cell) => cell === 0));
  }

  start(emptyStart = false) {
    this.status = 'playing';
    this.score = 0;

    this.field = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });

    if (this.initialState) {
      this.field = this.initialState.map((r) => r.slice());
    } else if (!emptyStart) {
      const added = this.addRandomTile();

      if (added && this.hasEmptyCells()) {
        this.addRandomTile();
      }
    }

    return this.status;
  }

  restart() {
    return this.start();
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.field[r][c] === 0) {
          return false;
        }
      }

      for (let i = 0; i < 4; i++) {
        for (let c = 0; c < 4; c++) {
          if (c < 3 && this.field[i][c] === this.field[i][c + 1]) {
            return false;
          }

          if (i < 3 && this.field[i][c] === this.field[i + 1][c]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  messageOfVictory() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.field[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  setState(newState) {
    if (Array.isArray(newState) && newState.length === 4) {
      this.field = newState;
    }
  }

  setScore(score) {
    this.score = score;
  }
}

module.exports = Game;
