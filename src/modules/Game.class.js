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
    this.board = initialState || this._createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  _createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  _getEmptyCells() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          empty.push({ x: i, y: j });
        }
      }
    }

    return empty;
  }

  _addRandomTile() {
    const emptyCells = this._getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];
      const newRow = [];

      for (let j = 0; j < 4; j++) {
        if (row[j] !== 0) {
          newRow.push(row[j]);
        }
      }

      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow.splice(j + 1, 1);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== newRow[j]) {
          moved = true;
        }

        this.board[i][j] = newRow[j];
      }
    }

    if (moved) {
      this._addRandomTile();
      this._checkGameStatus();
    }
  }

  moveRight() {
    this._reverseRows();
    this.moveLeft();
    this._reverseRows();
  }

  moveUp() {
    this._transpose();
    this.moveLeft();
    this._transpose();
  }

  moveDown() {
    this._transpose();
    this._reverseRows();
    this.moveLeft();
    this._reverseRows();
    this._transpose();
  }

  _reverseRows() {
    this.board = this.board.map((row) => row.reverse());
  }

  _transpose() {
    const newBoard = this._createEmptyBoard();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }

    this.board = newBoard;
  }

  _checkGameStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (this._getEmptyCells().length > 0) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (j < 3 && this.board[i][j] === this.board[i][j + 1]) ||
          (i < 3 && this.board[i][j] === this.board[i + 1][j])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
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
    return this.board.map((row) => [...row]);
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
    this.board = this._createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this._addRandomTile();
    this._addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }
}

module.exports = Game;
