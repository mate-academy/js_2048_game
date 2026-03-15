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
  constructor(initialState = null) {
    this.size = 4;

    this.board =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.mergeRow(row));

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.board = this.board
      .map((row) => row.reverse())
      .map((row) => this.mergeRow(row))
      .map((row) => row.reverse());

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.transpose();
    this.board = this.board.map((row) => this.mergeRow(row));
    this.transpose();

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.transpose();

    this.board = this.board
      .map((row) => row.reverse())
      .map((row) => this.mergeRow(row))
      .map((row) => row.reverse());

    this.transpose();

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
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
    const generateRow = () => Array(this.size).fill(0);

    this.board = Array.from({ length: this.size }, generateRow);

    this.score = 0;
    this.status = 'idle';
  }

  mergeRow(row) {
    const filtered = row.filter((n) => n !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;

        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    const merged = filtered.filter((n) => n !== 0);

    const zeros = new Array(this.size - merged.length).fill(0);

    return [...merged, ...zeros];
  }

  transpose() {
    const getColumn = (colIndex) => this.board.map((row) => row[colIndex]);

    this.board = this.board[0].map((_, colIndex) => getColumn(colIndex));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const [row, colIndex] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (Math.random() < 0.9) {
      this.board[row][colIndex] = 2;
    } else {
      this.board[row][colIndex] = 4;
    }
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return;
        }
      }
    }

    for (let c = 0; c < this.size; c++) {
      for (let r = 0; r < this.size - 1; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
