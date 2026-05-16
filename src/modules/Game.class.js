/* eslint-disable function-paren-newline */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState = null) {
    this.initialState = initialState;
    this.state = this._cloneBoard(initialState || this._emptyBoard());
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (!this.initialState) {
      this.state = this._emptyBoard();

      this._addRandomTile();
      this._addRandomTile();
    } else {
      this.state = this._cloneBoard(this.initialState);
    }

    this.score = 0;
    this.status = 'playing';
  }

  restart() {
    this.state = this._cloneBoard(this.initialState || this._emptyBoard());

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this._move((board) => board.map((row) => this._slide(row)));
  }

  moveRight() {
    this._move((board) =>
      board.map((row) => this._slide([...row].reverse()).reverse()),
    );
  }

  moveUp() {
    this._move((board) => {
      const transposed = this._transpose(board);

      const moved = transposed.map((row) => this._slide(row));

      return this._transpose(moved);
    });
  }

  moveDown() {
    this._move((board) => {
      const transposed = this._transpose(board);

      const moved = transposed.map((row) =>
        this._slide([...row].reverse()).reverse(),
      );

      return this._transpose(moved);
    });
  }

  _move(transform) {
    const prev = this._cloneBoard(this.state);
    const next = transform(this._cloneBoard(this.state));

    // якщо нічого не змінилось — все одно перевіряємо lose
    if (this._boardsEqual(prev, next)) {
      if (!this._hasMoves()) {
        this.status = 'lose';
      }

      return;
    }

    this.state = next;

    this._addRandomTile();

    if (this._checkWin()) {
      this.status = 'win';

      return;
    }

    if (!this._hasMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }
  _slide(row) {
    const filtered = row.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        this.score += merged;

        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  _emptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  _cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  _transpose(board) {
    return board[0].map((_, index) => board.map((row) => row[index]));
  }

  _addRandomTile() {
    const empty = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          empty.push([rowIndex, colIndex]);
        }
      });
    });

    if (!empty.length) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  _checkWin() {
    return this.state.flat().includes(2048);
  }

  _hasMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }

        if (
          (c < 3 && this.state[r][c] === this.state[r][c + 1]) ||
          (r < 3 && this.state[r][c] === this.state[r + 1][c])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  _boardsEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}

module.exports = Game;
