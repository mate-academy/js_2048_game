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
    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();

    this.score = 0;
    this.status = 'idle';

    if (!initialState) {
      this.addRandomBox();
      this.addRandomBox();
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((cell) => cell !== 0);
      const merged = new Array(newRow.length).fill(false);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1] && !merged[i] && !merged[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
          merged[i] = true;
          moved = true;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (this.board[row].some((cell, idx) => cell !== newRow[idx])) {
        moved = true;
        this.board[row] = newRow;
      }
    }

    if (moved) {
      this.addRandomBox();

      if (this.checkWin()) {
        return true;
      }

      if (!this.hasEmptuCellsCantMove()) {
        this.status = 'lose';
      }
    }

    return moved;
  }

  moveRight() {
    this.board = this.board.map((row) => [...row].reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => [...row].reverse());

    return moved;
  }

  moveUp() {
    this.transpose();

    const moved = this.moveLeft();

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();

    const moved = this.moveRight();

    this.transpose();

    return moved;
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
    return this.board;
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
    if (this.status === 'idle') {
      return 'idle';
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          return 'win';
        }
      }
    }

    if (!this.hasEmptuCellsCantMove()) {
      this.status = 'lose';

      return 'lose';
    }

    return 'playing';
  }

  /**
   * //&& !this.canMove()
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomBox();
    this.addRandomBox();
  }

  // Add your own methods here
  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomBox() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  hasEmptuCellsCantMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  // canMove() {
  //   for (let row = 0; row < 4; row++) {
  //     for (let col = 0; col < 4; col++) {
  //       if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
  //         return true;
  //       }

  //       if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
  //         return true;
  //       }
  //     }
  //   }

  //   return false;
  // }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }
  }

  transpose() {
    this.board = this.board[0].map((_, col) =>
      // eslint-disable-next-line comma-dangle, prettier/prettier
      this.board.map((row) => row[col]),);
  }
}

module.exports = Game;
