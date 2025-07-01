'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.initialState = initialState
      ? initialState.map((row) => row.slice())
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.board = this.initialState.map((row) => row.slice());

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => row.slice());

    this.board = this.board.map((row) => {
      let gained = 0;
      const clearRow = row.filter((v) => v !== 0);

      for (let r = 0; r < clearRow.length - 1; r++) {
        if (clearRow[r] === clearRow[r + 1]) {
          clearRow[r] *= 2;
          clearRow[r + 1] = 0;
          gained += clearRow[r];
        }
      }

      this.score += gained;

      const result = clearRow.filter((v) => v !== 0);

      while (result.length < 4) {
        result.push(0);
      }

      return result;
    });

    if (this._isBoardChanged(this.board, oldBoard)) {
      this._addNewNumber(this.board);
    }

    this._checkGameStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => row.slice());

    this.board = this.board.map((row) => {
      let gained = 0;
      const clearRow = row.filter((v) => v !== 0);

      for (let r = clearRow.length - 1; r > 0; r--) {
        if (clearRow[r] === clearRow[r - 1]) {
          clearRow[r] *= 2;
          clearRow[r - 1] = 0;
          gained += clearRow[r];
        }
      }

      this.score += gained;

      const result = clearRow.filter((v) => v !== 0);

      while (result.length < 4) {
        result.unshift(0);
      }

      return result;
    });

    if (this._isBoardChanged(this.board, oldBoard)) {
      this._addNewNumber(this.board);
    }

    this._checkGameStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < 4; col++) {
      const column = this.board.map((row) => row[col]);
      const compressedCol = this._compress(column);

      this.score += compressedCol.score;

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = compressedCol.column[row];
      }
    }

    if (this._isBoardChanged(this.board, oldBoard)) {
      this._addNewNumber(this.board);
    }

    this._checkGameStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < 4; col++) {
      const column = this.board.map((row) => row[col]).reverse();
      const compressedCol = this._compress(column);

      this.score += compressedCol.score;

      const finalColumn = compressedCol.column.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = finalColumn[row];
      }
    }

    if (this._isBoardChanged(this.board, oldBoard)) {
      this._addNewNumber(this.board);
    }

    this._checkGameStatus();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => row.slice());
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      this.score = 0;
      this.status = 'idle';
    }

    const emptyCells = this._getEmptyCells(this.board);

    if (emptyCells.length >= 2) {
      this._addNewNumber(this.board);
      this._addNewNumber(this.board);
    }
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState;
    this.score = 0;
    this.status = 'idle';
  }

  _getRandomEmptyCell(cells) {
    const index = Math.floor(Math.random() * cells.length);

    return cells.splice(index, 1)[0];
  }

  _compress(column) {
    const clearColumn = [];
    let gained = 0;

    for (let i = 0; i < column.length; i++) {
      if (column[i] !== 0) {
        clearColumn.push(column[i]);
      }
    }

    for (let y = 0; y < clearColumn.length - 1; y++) {
      if (clearColumn[y] === clearColumn[y + 1]) {
        clearColumn[y] *= 2;
        clearColumn[y + 1] = 0;
        gained += clearColumn[y];
      }
    }

    const result = clearColumn.filter((v) => v !== 0);

    while (result.length < 4) {
      result.push(0);
    }

    return { column: result, score: gained };
  }

  _getEmptyCells(board) {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  _isBoardFull(board) {
    return this._getEmptyCells(board).length === 0;
  }

  _isBoardChanged(newBoard, oldBoard) {
    return newBoard.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        return cell !== oldBoard[rowIndex][colIndex];
      });
    });
  }

  _addNewNumber(board) {
    const emptyCells = this._getEmptyCells(board);
    const newNumber = this._getRandomEmptyCell(emptyCells);

    if (newNumber) {
      const [row1, col1] = newNumber;

      board[row1][col1] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _checkGameStatus() {
    const flatBoard = this.board.flat();

    if (flatBoard.includes(2048)) {
      this.status = 'win';

      return;
    }

    if (flatBoard.includes(0)) {
      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (col < 3 && current === this.board[row][col + 1]) {
          return;
        }

        if (row < 3 && current === this.board[row + 1][col]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
