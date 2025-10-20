'use strict';

export default class Game {
  static SIZE = 4;
  static WIN_TILE = 2048;

  constructor(initialState = null) {
    this.initialState = initialState
      ? Game._deepCopyBoard(initialState)
      : Game._emptyBoard();
    this.board = Game._deepCopyBoard(this.initialState);
    this.score = 0;
    this.status = 'not_started';
    this._hasStarted = false;
  }

  getState() {
    return Game._deepCopyBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this._hasStarted) {
      return;
    }

    this._hasStarted = true;
    this.status = 'playing';

    if (Game._isBoardEmpty(this.board)) {
      this._spawnRandom();
      this._spawnRandom();
    }
  }

  restart() {
    this.board = Game._deepCopyBoard(this.initialState);
    this.score = 0;
    this.status = 'not_started';
    this._hasStarted = false;
  }

  moveLeft() {
    return this._move((row) => Game._moveArrayLeft(row));
  }

  moveRight() {
    return this._move((row) => Game._moveArrayRight(row));
  }

  moveUp() {
    this.board = Game._transpose(this.board);

    const moved = this._move((row) => Game._moveArrayLeft(row));

    this.board = Game._transpose(this.board);

    return moved;
  }

  moveDown() {
    this.board = Game._transpose(this.board);

    const moved = this._move((row) => Game._moveArrayRight(row));

    this.board = Game._transpose(this.board);

    return moved;
  }

  _move(transformRowFn) {
    if (this.status === 'over' || this.status === 'won') {
      return false;
    }

    if (!this._hasStarted) {
      this.start();
    }

    const beforeState = JSON.stringify(this.board);
    let mergedSumThisMove = 0;

    const newBoard = this.board.map((row) => {
      const { newRow, mergedSum } = transformRowFn(row);

      mergedSumThisMove += mergedSum;

      return newRow;
    });

    if (JSON.stringify(newBoard) === beforeState) {
      return false;
    }

    this.board = newBoard;
    this.score += mergedSumThisMove;

    if (Game._boardHasValue(this.board, Game.WIN_TILE)) {
      this.status = 'won';
    }

    this._spawnRandom();

    if (!this._hasAnyMoves()) {
      this.status = 'over';
    } else if (this.status !== 'won') {
      this.status = 'playing';
    }

    return true;
  }

  _spawnRandom() {
    const emptyCells = [];

    for (let rowIdx = 0; rowIdx < Game.SIZE; rowIdx++) {
      for (let colIdx = 0; colIdx < Game.SIZE; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          emptyCells.push([rowIdx, colIdx]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[r][c] = value;

    return true;
  }

  _hasAnyMoves() {
    if (Game._isBoardEmptyCellPresent(this.board)) {
      return true;
    }

    for (let rowIdx = 0; rowIdx < Game.SIZE; rowIdx++) {
      for (let colIdx = 0; colIdx < Game.SIZE - 1; colIdx++) {
        if (this.board[rowIdx][colIdx] === this.board[rowIdx][colIdx + 1]) {
          return true;
        }
      }
    }

    for (let colIdx = 0; colIdx < Game.SIZE; colIdx++) {
      for (let rowIdx = 0; rowIdx < Game.SIZE - 1; rowIdx++) {
        if (this.board[rowIdx][colIdx] === this.board[rowIdx + 1][colIdx]) {
          return true;
        }
      }
    }

    return false;
  }

  static _emptyBoard() {
    return Array.from({ length: Game.SIZE }, () => Array(Game.SIZE).fill(0));
  }

  static _deepCopyBoard(board) {
    return board.map((row) => row.slice());
  }

  static _isBoardEmpty(board) {
    for (let i = 0; i < Game.SIZE; i++) {
      for (let j = 0; j < Game.SIZE; j++) {
        if (board[i][j] !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  static _isBoardEmptyCellPresent(board) {
    for (let i = 0; i < Game.SIZE; i++) {
      for (let j = 0; j < Game.SIZE; j++) {
        if (board[i][j] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  static _boardHasValue(board, value) {
    for (let i = 0; i < Game.SIZE; i++) {
      for (let j = 0; j < Game.SIZE; j++) {
        if (board[i][j] === value) {
          return true;
        }
      }
    }

    return false;
  }

  static _transpose(board) {
    const newBoard = Game._emptyBoard();

    for (let i = 0; i < Game.SIZE; i++) {
      for (let j = 0; j < Game.SIZE; j++) {
        newBoard[j][i] = board[i][j];
      }
    }

    return newBoard;
  }

  static _moveArrayLeft(row) {
    const size = row.length;
    const tiles = row.filter((v) => v !== 0);
    const mergedFlags = Array(tiles.length).fill(false);
    let mergedSum = 0;

    for (let i = 0; i < tiles.length - 1; i++) {
      if (!mergedFlags[i] && tiles[i] === tiles[i + 1]) {
        tiles[i] *= 2;
        mergedSum += tiles[i];
        tiles.splice(i + 1, 1);
        mergedFlags[i] = true;
        mergedFlags.splice(i + 1, 1);
      }
    }

    const newRow = tiles.concat(Array(size - tiles.length).fill(0));

    return { newRow, mergedSum };
  }

  static _moveArrayRight(row) {
    const reversed = row.slice().reverse();
    const { newRow, mergedSum } = Game._moveArrayLeft(reversed);

    return { newRow: newRow.reverse(), mergedSum };
  }
}
