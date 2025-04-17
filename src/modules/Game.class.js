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

    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      this.currentRow = rowIndex;
      newBoard.push(this._mergeLine(this.board[rowIndex]));
    }

    return this._finalizeMove(newBoard, oldState);
  }

  moveRight() {
    const oldState = this.getState();
    const newBoard = [];

    for (const row of this.board) {
      const reversed = row.slice().reverse();
      const merged = this._mergeLine(reversed).reverse();

      newBoard.push(merged);
    }

    return this._finalizeMove(newBoard, oldState);
  }

  moveUp() {
    const oldState = this.getState();
    const newBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < this.size; col++) {
      const column = this._getColumn(this.board, col);
      const merged = this._mergeLine(column);

      this._setColumn(newBoard, col, merged);
    }

    return this._finalizeMove(newBoard, oldState);
  }

  moveDown() {
    const oldState = this.getState();
    const newBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < this.size; col++) {
      const column = this._getColumn(this.board, col).reverse();
      const merged = this._mergeLine(column).reverse();

      this._setColumn(newBoard, col, merged);
    }

    return this._finalizeMove(newBoard, oldState);
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

  // Private methods section
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
      this.lastInserted = { row, col };
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

  _mergeLine(line) {
    const filtered = line.filter((v) => v !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;

        merged.push(value);
        this.score += value;

        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  _finalizeMove(newBoard, oldState) {
    const changed = JSON.stringify(oldState) !== JSON.stringify(newBoard);

    if (!changed) {
      return false;
    }

    this.mergePositions = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (oldState[r][c] > 0 && newBoard[r][c] === oldState[r][c] * 2) {
          this.mergePositions.push({ row: r, col: c });
        }
      }
    }

    this.board = newBoard;

    if (this._contains2048()) {
      this.status = 'win';
    } else {
      this._addRandomTile();

      if (!this._hasAvailableMoves()) {
        this.status = 'lose';
      }
    }

    return true;
  }

  _getColumn(board, col) {
    return board.map((row) => row[col]);
  }

  _setColumn(board, col, values) {
    for (let row = 0; row < this.size; row++) {
      board[row][col] = values[row];
    }
  }
}

module.exports = Game;
