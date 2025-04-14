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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  moveLeft() {
    if (this.status === 'playing') {
      let moved = false;

      for (let row = 0; row < 4; row++) {
        const compressed = this.compress(this.board[row]);
        const merged = this.merge(compressed);

        if (!this.areEqual(this.board[row], merged)) {
          moved = true;
        }
        this.board[row] = merged;
      }

      if (moved) {
        this.finalizeMove();
      }
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      this.reverseBoard();
      this.moveLeft();
      this.reverseBoard();
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      this.transposeBoard();
      this.moveLeft();
      this.transposeBoard();
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      this.transposeBoard();
      this.moveRight();
      this.transposeBoard();
    }
  }

  /**
   * Adds a random tile (2 or 4) to the board.
   */
  addRandomTile() {
    const emptyCells = [];

    for (let row2 = 0; row2 < 4; row2++) {
      for (let col2 = 0; col2 < 4; col2++) {
        if (this.board[row2][col2] === 0) {
          emptyCells.push({ row: row2, col: col2 });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  /**
   * Compresses a row by removing zeros and shifting numbers to the left.
   *
   * @param {number[]} row
   * @returns {number[]}
   */
  compress(row) {
    const filtered = row.filter((num) => num !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  /**
   * Merges adjacent equal numbers in a row and updates the score.
   *
   * @param {number[]} row
   * @returns {number[]}
   */
  merge(row) {
    for (let i = 0; i < 3; i++) {
      if (row[i] === row[i + 1] && row[i] !== 0) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return this.compress(row);
  }

  /**
   * Reverses the board rows to assist with rightward movements.
   */
  reverseBoard() {
    this.board = this.board.map((row) => row.reverse());
  }

  /**
   * Transposes the board to assist with upward and downward movements.
   */
  transposeBoard() {
    const transposed = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        transposed[col][row] = this.board[row][col];
      }
    }
    this.board = transposed;
  }

  /**
   * Checks if two arrays are equal.
   *
   * @param {number[]} array1
   * @param {number[]} array2
   * @returns {boolean}
   */
  areEqual(array1, array2) {
    return array1.every((val, index) => val === array2[index]);
  }

  /**
   * Checks if the game is over (no valid moves left).
   *
   * @returns {boolean}
   */
  isGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Finalizes the move by adding a random tile and checking game status.
   */
  finalizeMove() {
    this.addRandomTile();

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (this.isGameOver()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
