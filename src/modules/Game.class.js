/* eslint-disable function-paren-newline */
'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.lastMerged = [];

    this.board = initialState
      ? initialState.map((row) => row.slice())
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _compressAndMerge(row) {
    const mergedIndexes = [];
    let filtered = row.filter((v) => v !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
        mergedIndexes.push(i);
        i++;
      }
    }

    filtered = filtered.filter((v) => v !== 0);

    while (filtered.length < this.size) {
      filtered.push(0);
    }

    return { newRow: filtered, mergedIndexes };
  }

  _beforeMove() {
    this.lastMerged = [];
  }

  _afterMove(moved) {
    if (moved) {
      this.spawnRandomTile();
      this.updateStatus();
    }
  }

  moveLeft() {
    this._beforeMove();

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const { newRow, mergedIndexes } = this._compressAndMerge(this.board[r]);

      if (!this.arraysEqual(this.board[r], newRow)) {
        this.board[r] = newRow;
        mergedIndexes.forEach((i) => this.lastMerged.push({ row: r, col: i }));
        moved = true;
      }
    }

    if (moved) {
      this.spawnRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    this._beforeMove();

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const reversed = this.board[r].slice().reverse();
      const { newRow, mergedIndexes } = this._compressAndMerge(reversed);
      const restored = newRow.reverse();

      if (!this.arraysEqual(this.board[r], restored)) {
        this.board[r] = restored;

        mergedIndexes.forEach((i) => {
          const col = this.size - 1 - i;

          this.lastMerged.push({ row: r, col });
        });
        moved = true;
      }
    }

    if (moved) {
      this.spawnRandomTile();
    }

    this.updateStatus();
  }

  moveUp() {
    this._beforeMove();

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = Array.from({ length: this.size }, (_, r) => this.board[r][c]);
      const { newRow: newCol, mergedIndexes } = this._compressAndMerge(col);

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          this.board[r][c] = newCol[r];
          moved = true;
        }
      }
      mergedIndexes.forEach((i) => this.lastMerged.push({ row: i, col: c }));
    }

    this._afterMove(moved);

    this.updateStatus();
  }

  moveDown() {
    this._beforeMove();

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = Array.from(
        { length: this.size },
        (_, r) => this.board[r][c],
      ).reverse();
      const { newRow: newColRev, mergedIndexes } = this._compressAndMerge(col);
      const newCol = newColRev.reverse();

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          this.board[r][c] = newCol[r];
          moved = true;
        }
      }

      mergedIndexes.forEach((i) => {
        const row = this.size - 1 - i;

        this.lastMerged.push({ row, col: c });
      });
    }

    this._afterMove(moved);
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
    this.status = 'playing';
    this.score = 0;

    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0),
    );

    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  restart() {
    this.status = 'idle';
    this.start();
  }

  spawnRandomTile() {
    const emptyCells = [];

    for (let rowIdx = 0; rowIdx < this.size; rowIdx++) {
      for (let colIdx = 0; colIdx < this.size; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          emptyCells.push({ row: rowIdx, col: colIdx });
        }
      }
    }

    if (emptyCells.length === 0) {
      return null;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    return { row, col };
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (val === 0) {
          return true;
        }

        if (r < this.size - 1 && val === this.board[r + 1][c]) {
          return true;
        }

        if (c < this.size - 1 && val === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
