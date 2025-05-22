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
    this.size = 4;
    this.board = initialState || this.#createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const row = this.board[i].filter((val) => val !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;

          if (row[j] === 2048) {
            this.status = 'win';
          }
        }
      }

      const newRow = row.filter((val) => val !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (this.board[i].toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[i] = newRow;
    }

    if (moved) {
      this.#addRandomTile();

      if (this.#isGameOver()) {
        this.status = 'lose';
      }
    }
  }

  moveRight() {
    this.board = this.#reverseRows(this.board);
    this.moveLeft();
    this.board = this.#reverseRows(this.board);
  }

  moveUp() {
    this.board = this.#transpose(this.board);
    this.moveLeft();
    this.board = this.#transpose(this.board);
  }

  moveDown() {
    this.board = this.#transpose(this.board);
    this.board = this.#reverseRows(this.board);
    this.moveLeft();
    this.board = this.#reverseRows(this.board);
    this.board = this.#transpose(this.board);
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
    return this.board.map((row) => [...row]); // копія масиву
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
    if (this.status === 'idle') {
      this.board = this.#createEmptyBoard();
      this.#addRandomTile();
      this.#addRandomTile();
      this.status = 'playing';
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  #createEmptyBoard() {
    const board = [];

    for (let i = 0; i < 4; i++) {
      board.push([0, 0, 0, 0]);
    }

    return board;
  }

  #addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  #isGameOver() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  #reverseRows(matrix) {
    return matrix.map((row) => [...row].reverse());
  }

  #transpose(matrix) {
    const result = [];

    for (let i = 0; i < matrix[0].length; i++) {
      const newRow = [];

      for (let j = 0; j < matrix.length; j++) {
        newRow.push(matrix[j][i]);
      }

      result.push(newRow);
    }

    return result;
  }
}

module.exports = Game;
