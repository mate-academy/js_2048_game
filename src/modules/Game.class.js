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
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = initialState;
    } else {
      this.board = this.createEmptyBoard();
    }
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let row = 0; row < this.size; row++) {
      let current = this.board[row].filter((val) => val !== 0);

      for (let i = 0; i < current.length - 1; i++) {
        if (current[i] === current[i + 1]) {
          current[i] *= 2;
          current[i + 1] = 0;
          this.score += current[i];
        }
      }

      current = current.filter((val) => val !== 0);

      while (current.length < this.size) {
        current.push(0);
      }

      this.board[row] = current;
    }

    if (this.boardsAreDifferent(oldBoard, this.board)) {
      this.addRandomTile();
    }
  }
  moveRight() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let row = 0; row < this.size; row++) {
      let current = this.board[row]
        .slice()
        .reverse()
        .filter((val) => val !== 0);

      for (let i = 0; i < current.length - 1; i++) {
        if (current[i] === current[i + 1]) {
          current[i] *= 2;
          current[i + 1] = 0;
          this.score += current[i];
        }
      }

      current = current.filter((val) => val !== 0);

      while (current.length < this.size) {
        current.push(0);
      }

      this.board[row] = current.reverse();
    }

    if (this.boardsAreDifferent(oldBoard, this.board)) {
      this.addRandomTile();
    }
  }
  moveUp() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < this.size; col++) {
      let current = [];

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== 0) {
          current.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < current.length - 1; i++) {
        if (current[i] === current[i + 1]) {
          current[i] *= 2;
          current[i + 1] = 0;
          this.score += current[i];
        }
      }

      current = current.filter((val) => val !== 0);

      while (current.length < this.size) {
        current.push(0);
      }

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = current[row];
      }
    }

    if (this.boardsAreDifferent(oldBoard, this.board)) {
      this.addRandomTile();
    }
  }
  moveDown() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < this.size; col++) {
      let current = [];

      for (let row = this.size - 1; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          current.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < current.length - 1; i++) {
        if (current[i] === current[i + 1]) {
          current[i] *= 2;
          current[i + 1] = 0;
          this.score += current[i];
        }
      }

      current = current.filter((val) => val !== 0);

      while (current.length < this.size) {
        current.push(0);
      }

      for (let row = this.size - 1; row >= 0; row--) {
        this.board[row][col] = current[this.size - 1 - row];
      }
    }

    if (this.boardsAreDifferent(oldBoard, this.board)) {
      this.addRandomTile();
    }
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
    if (this.status === 'win' || this.status === 'lose') {
      return this.status;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return this.status;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const val = this.board[row][col];

        if (val === 0) {
          return 'playing';
        }

        if (
          (col < this.size - 1 && val === this.board[row][col + 1]) ||
          (row < this.size - 1 && val === this.board[row + 1][col])
        ) {
          return 'playing';
        }
      }
    }

    this.status = 'lose';

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.board = this.createEmptyBoard();
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here
  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [targetRow, targetCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[targetRow][targetCol] = Math.random() < 0.9 ? 2 : 4;
  }

  boardsAreDifferent(board1, board2) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
