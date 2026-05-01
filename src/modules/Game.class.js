'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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

    this.initialState = initialState || this.createEmptyBoard();
    this.board = this.cloneBoard(this.initialState);

    this.score = 0;
    this.status = 'idle'; // idle | playing | win | lose
    this.hasStarted = false;
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move((row) => row);

    if (moved) {
      this.afterMove();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move((row) => row.slice().reverse());

    if (moved) {
      this.afterMove();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.transpose();

    const moved = this.move((row) => row);

    this.transpose();

    if (moved) {
      this.afterMove();
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.transpose();

    const moved = this.move((row) => row.reverse());

    this.transpose();

    if (moved) {
      this.afterMove();
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
    this.hasStarted = true;

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.hasStarted = true;

    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here

  // ================= CORE LOGIC =================

  move(transform) {
    let moved = false;

    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].slice();
      const original = row.slice();

      row = transform(row);
      row = this.compress(row);
      row = this.merge(row);
      row = this.compress(row);
      row = transform(row);

      this.board[i] = row;

      if (!this.arraysEqual(original, row)) {
        moved = true;
      }
    }

    return moved;
  }

  compress(row) {
    return row
      .filter((x) => x !== 0)
      .concat(Array(this.size - row.filter((x) => x !== 0).length).fill(0));
  }

  merge(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return row;
  }

  afterMove() {
    this.addRandomTile();

    if (this.hasWon()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  // ================= HELPERS =================

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }

    this.board = newBoard;
  }

  addRandomTile() {
    const empty = [];

    for (let i2 = 0; i2 < this.size; i2++) {
      for (let j2 = 0; j2 < this.size; j2++) {
        if (this.board[i2][j2] === 0) {
          empty.push([i2, j2]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];

    this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  hasWon() {
    return this.board.some((row) => row.includes(2048));
  }

  canMove() {
    // є пусті клітинки
    for (const row of this.board) {
      if (row.includes(0)) {
        return true;
      }
    }

    // можна злити по горизонталі
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    // можна злити по вертикалі
    for (let j = 0; j < this.size; j++) {
      for (let i = 0; i < this.size - 1; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  arraysEqual(a, b) {
    return a.every((val, i) => val === b[i]);
  }
}
