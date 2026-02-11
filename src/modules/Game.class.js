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
    // console.log(initialState);
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState || this.createEmptyBoard();
    this.board = this.cloneBoard(this.initialState);
  }

  moveLeft() {
    return this.makeMove();
  }

  moveRight() {
    return this.makeMove(false, true);
  }

  moveUp() {
    return this.makeMove(true);
  }

  moveDown() {
    return this.makeMove(true, true);
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
    return this.cloneBoard(this.board);
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
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  createEmptyBoard() {
    return [...Array(this.size)].map(() => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [x, y] = empty[Math.floor(Math.random() * empty.length)];

    this.board[x][y] = Math.random() < 0.1 ? 4 : 2;
  }

  makeMove(isVertical = false, isReverse = false) {
    if (this.status !== 'playing') {
      return false;
    }

    const prevBoard = this.cloneBoard(this.board);

    if (isVertical) {
      this.transpose();
    }

    this.board = this.board.map((row) => {
      let r = row.slice();

      if (isReverse) {
        r.reverse();
      }

      r = this.mergeRow(r);

      if (isReverse) {
        r.reverse();
      }

      return r;
    });

    if (isVertical) {
      this.transpose();
    }

    if (!this.boardsEqual(prevBoard, this.board)) {
      this.addRandomTile();
      this.updateStatus();

      return true;
    }

    return false;
  }

  mergeRow(row) {
    const filtered = row.filter((v) => v !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        this.score += merged;
        result.push(merged);
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  hasMoves() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  boardsEqual(a, b) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (a[i][j] !== b[i][j]) {
          return false;
        }
      }
    }

    return true;
  }
}
module.exports = Game;
