'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => row.slice())
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    const oldState = this.getState();
    const newBoard = [];

    for (const row of this.board) {
      const filtered = row.filter((v) => v !== 0);
      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      newBoard.push(merged);
    }

    const changed = JSON.stringify(oldState) !== JSON.stringify(newBoard);

    if (changed) {
      this.board = newBoard;

      if (this._contains2048()) {
        this.status = 'win';
      } else {
        this._addRandomTile();

        if (!this._hasAvailableMoves()) {
          this.status = 'lose';
        }
      }
    }

    return changed;
  }

  moveRight() {
    const oldState = this.getState();
    const newBoard = [];

    for (const row of this.board) {
      const reversed = row.slice().reverse();
      const filtered = reversed.filter((v) => v !== 0);
      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      newBoard.push(merged.reverse());
    }

    const changed = JSON.stringify(oldState) !== JSON.stringify(newBoard);

    if (changed) {
      this.board = newBoard;

      if (this._contains2048()) {
        this.status = 'win';
      } else {
        this._addRandomTile();

        if (!this._hasAvailableMoves()) {
          this.status = 'lose';
        }
      }
    }

    return changed;
  }

  moveUp() {
    const oldState = this.getState();
    const newBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      const merged = [];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === column[i + 1]) {
          merged.push(column[i] * 2);
          this.score += column[i] * 2;
          i++;
        } else {
          merged.push(column[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      for (let row = 0; row < this.size; row++) {
        newBoard[row][col] = merged[row];
      }
    }

    const changed = JSON.stringify(oldState) !== JSON.stringify(newBoard);

    if (changed) {
      this.board = newBoard;

      if (this._contains2048()) {
        this.status = 'win';
      } else {
        this._addRandomTile();

        if (!this._hasAvailableMoves()) {
          this.status = 'lose';
        }
      }
    }

    return changed;
  }

  moveDown() {
    const oldState = this.getState();
    const newBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = this.size - 1; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      const merged = [];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === column[i + 1]) {
          merged.push(column[i] * 2);
          this.score += column[i] * 2;
          i++;
        } else {
          merged.push(column[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      for (let row = this.size - 1, i = 0; row >= 0; row--, i++) {
        newBoard[row][col] = merged[i];
      }
    }

    const changed = JSON.stringify(oldState) !== JSON.stringify(newBoard);

    if (changed) {
      this.board = newBoard;

      if (this._contains2048()) {
        this.status = 'win';
      } else {
        this._addRandomTile();

        if (!this._hasAvailableMoves()) {
          this.status = 'lose';
        }
      }
    }

    return changed;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => row.slice());
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this._addRandomTile();
      this._addRandomTile();
    }
  }

  // Restart method
  restart() {
    this.board = Array.from(
      { length: this.size },
      () => Array(this.size).fill(0),
      // eslint-disable-next-line function-paren-newline
    );
    this.score = 0;
    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  // Custom private methods
  _addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length !== 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _contains2048() {
    return this.board.some((row) => row.includes(2048));
  }

  _hasAvailableMoves() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (
          col < this.size - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.size - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
