'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.grid = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.grid);

    this.grid = this.grid.map((row) => this._slideAndMerge(row));
    this._postMoveHandler(prevState);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.grid);

    this.grid = this.grid.map((row) => this._slideRight(row));

    this.grid = this.grid.map((row) => this._mergeRight(row));

    this._postMoveHandler(prevState);
  }

  _slideRight(row) {
    const filtered = row.filter((cell) => cell !== 0);
    const merged = new Array(4).fill(0);

    let emptyIndex = 3;

    for (let i = filtered.length - 1; i >= 0; i--) {
      merged[emptyIndex--] = filtered[i];
    }

    return merged;
  }

  _mergeRight(row) {
    const merged = row.slice();

    for (let i = 3; i > 0; i--) {
      if (merged[i] === merged[i - 1] && merged[i] !== 0) {
        merged[i] *= 2;
        this.score += merged[i];
        merged[i - 1] = 0;
      }
    }

    return this._slideRight(merged);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.grid);

    this._transposeGrid();
    this.grid = this.grid.map((row) => this._slideAndMerge(row));
    this._transposeGrid();
    this._postMoveHandler(prevState);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.grid);

    this._transposeGrid();

    this.grid = this.grid.map(
      (row) => this._slideAndMerge(row.reverse()).reverse(),
      // eslint-disable-next-line function-paren-newline
    );
    this._transposeGrid();
    this._postMoveHandler(prevState);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.grid;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this._addRandomCell();
    this._addRandomCell();
  }

  restart() {
    this.score = 0;
    this.grid = this.initialState.map((row) => [...row]);
    this.status = 'idle';
  }

  _slideAndMerge(row) {
    const filtered = row.filter((cell) => cell !== 0);
    const merged = [];

    let skipNext = false;

    for (let i = 0; i < filtered.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        skipNext = true;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  _transposeGrid() {
    this.grid = this.grid[0].map(
      (_, colIndex) => this.grid.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );
  }

  _addRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _postMoveHandler(prevState) {
    if (JSON.stringify(this.grid) !== prevState) {
      this._addRandomCell();

      if (this._checkWin()) {
        this.status = 'win';
      } else if (!this._hasAvailableMoves()) {
        this.status = 'lose';
      }
    }
  }

  _checkWin() {
    return this.grid.some((row) => row.some((cell) => cell === 2048));
  }

  _hasAvailableMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.grid[r][c] === this.grid[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
