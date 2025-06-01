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
    this.score = 0;
    this.status = 'playing';

    if (initialState) {
      this.board = initialState.map((row) => row.slice());
    } else {
      this.start();
    }
  }

  // Add Random Tile on the board
  _addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = newValue;
  }
  // Merge Row
  _slideAndMergeRow(row) {
    const nonZero = row.filter((x) => x !== 0);

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        nonZero[i] *= 2;
        nonZero[i + 1] = 0;
        this.score += nonZero[i];
      }
    }

    const merged = nonZero.filter((x) => x !== 0);

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }
  // Check if two arrays are equal
  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  // Transpose Matrix
  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
  moveLeft() {
    const oldBoard = this.board.map((row) => [...row]);
    const newBoard = this.board.map((row) => this._slideAndMergeRow(row));

    const hasChanged = oldBoard.some((row, i) => {
      return !this.arraysEqual(row, newBoard[i]);
    });

    if (hasChanged) {
      this.board = newBoard;
      this._addRandomTile();
    }

    this.checkGameStatus();
  }
  moveRight() {
    const oldBoard = this.board.map((row) => [...row]);
    const newBoard = this.board.map((row) => {
      return this._slideAndMergeRow([...row].reverse()).reverse();
    });

    const hasChanged = oldBoard.some((row, i) => {
      return !this.arraysEqual(row, newBoard[i]);
    });

    if (hasChanged) {
      this.board = newBoard;
      this._addRandomTile();
    }

    this.checkGameStatus();
  }
  moveUp() {
    const oldBoard = this.board.map((row) => [...row]);
    const transposed = this.transpose(this.board);
    const moved = transposed.map((row) => this._slideAndMergeRow(row));
    const newBoard = this.transpose(moved);

    const hasChanged = oldBoard.some((row, i) => {
      return !this.arraysEqual(row, newBoard[i]);
    });

    if (hasChanged) {
      this.board = newBoard;
      this._addRandomTile();
    }

    this.checkGameStatus();
  }
  moveDown() {
    const oldBoard = this.board.map((row) => [...row]);
    const transposed = this.transpose(this.board);
    const moved = transposed.map((row) => {
      return this._slideAndMergeRow([...row].reverse()).reverse();
    });
    const newBoard = this.transpose(moved);

    const hasChanged = oldBoard.some((row, i) => {
      return !this.arraysEqual(row, newBoard[i]);
    });

    if (hasChanged) {
      this.board = newBoard;
      this._addRandomTile();
    }

    this.checkGameStatus();
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

  checkGameStatus() {
    if (this.checkGameOver()) {
      this.status = 'lose';
    } else if (this.checkGameWin()) {
      this.status = 'win';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));

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

  checkGameWin() {
    return this.board.some((row) => row.includes(2048));
  }
  checkGameOver() {
    if (this.board.flat().includes(0)) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.board[i][j];

        if (
          (i < 3 && this.board[i + 1][j] === current) ||
          (j < 3 && this.board[i][j + 1] === current)
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
