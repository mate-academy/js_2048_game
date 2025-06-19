'use strict';

/**
 * 2048 Game Logic Class
 * - Each instance has its own initial board state (no shared state).
 * - Prevents moves after win or loss.
 */

const defaultBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  constructor(initialState) {
    this.initialBoard = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : JSON.parse(JSON.stringify(defaultBoard));
    this.board = JSON.parse(JSON.stringify(this.initialBoard));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') return;

    const oldBoard = JSON.parse(JSON.stringify(this.board));
    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i].filter(v => v !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
        }
      }
      row = row.filter(v => v !== 0);
      while (row.length < 4) row.push(0);
      this.board[i] = row;
    }

    this._postMove(oldBoard);
  }

  moveRight() {
    if (this.status !== 'playing') return;

    const oldBoard = JSON.parse(JSON.stringify(this.board));
    for (let i = 0; i < this.board.length; i++) {
      let row = [...this.board[i]].reverse().filter(v => v !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
        }
      }
      row = row.filter(v => v !== 0);
      while (row.length < 4) row.push(0);
      row.reverse();
      this.board[i] = row;
    }

    this._postMove(oldBoard);
  }

  moveUp() {
    if (this.status !== 'playing') return;

    const oldBoard = JSON.parse(JSON.stringify(this.board));
    for (let col = 0; col < 4; col++) {
      let column = [];
      for (let row = 0; row < 4; row++) column.push(this.board[row][col]);
      column = this._processLine(column);
      for (let row = 0; row < 4; row++) this.board[row][col] = column[row];
    }

    this._postMove(oldBoard);
  }

  moveDown() {
    if (this.status !== 'playing') return;

    const oldBoard = JSON.parse(JSON.stringify(this.board));
    for (let col = 0; col < 4; col++) {
      let column = [];
      for (let row = 0; row < 4; row++) column.push(this.board[row][col]);
      column = this._processLine(column.reverse());
      column.reverse();
      for (let row = 0; row < 4; row++) this.board[row][col] = column[row];
    }

    this._postMove(oldBoard);
  }

  _postMove(oldBoard) {
    if (!this._boardsAreEqual(this.board, oldBoard)) {
      if (this._hasWon()) return;
      if (this._canMove()) {
        this._addRandomTile();
      }
    } else if (!this._canMove()) {
      this.status = 'lose';
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
    this.board = JSON.parse(JSON.stringify(defaultBoard));
    this.score = 0;
    for (let i = 0; i < 2; i++) this._addRandomTile();
    this.status = 'playing';
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialBoard));
    this.score = 0;
    this.status = 'idle';
  }

  _addRandomTile() {
    const empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];
      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _boardsAreEqual(b1, b2) {
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        if (b1[i][j] !== b2[i][j]) return false;
    return true;
  }

  _processLine(line) {
    let newLine = line.filter(v => v !== 0);
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        this.score += newLine[i];
        newLine[i + 1] = 0;
      }
    }
    newLine = newLine.filter(v => v !== 0);
    while (newLine.length < 4) newLine.push(0);
    return newLine;
  }

  _hasWon() {
    if (this.board.some(row => row.includes(2048))) {
      this.status = 'win';
      return true;
    }
    return false;
  }

  _canMove() {
    if (this.board.some(row => row.includes(0))) {
      this.status = 'playing';
      return true;
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.board[i][j] === this.board[i][j + 1] ||
          this.board[j][i] === this.board[j + 1][i]
        ) {
          this.status = 'playing';
          return true;
        }
      }
    }
    this.status = 'lose';
    return false;
  }
}

module.exports = Game;