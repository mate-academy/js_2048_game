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
    this.defaultState = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : null;

    this.board =
      initialState ||
      Array(4)
        .fill(0)
        .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  moveLeft() {
    this.move((row) =>
      row
        .filter((v) => v)
        // eslint-disable-next-line prettier/prettier
        .concat(Array(4 - row.filter((v) => v).length).fill(0)));
  }
  moveRight() {
    this.move((row) =>
      Array(4 - row.filter((v) => v).length)
        .fill(0)
        // eslint-disable-next-line prettier/prettier
        .concat(row.filter((v) => v)));
  }

  moveUp() {
    this.transposeAndMove('up');
  }

  moveDown() {
    this.transposeAndMove('down');
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
    if (this.status !== 'playing') {
      this.status = 'playing';
    }

    this.spawnTile();
    this.spawnTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    const x = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));

    this.board = this.defaultState
      ? JSON.parse(JSON.stringify(this.defaultState))
      : x;
    this.score = 0;
    this.status = 'idle';
    // this.start();
  }

  // Add your own methods here
  move(transformFunc) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.board = this.board.map(transformFunc);
    this.mergeTiles(transformFunc);

    if (JSON.stringify(this.board) !== oldBoard) {
      this.spawnTile();
      this.checkGameState();
    }
  }

  mergeTiles(transformFunc) {
    this.board = this.board.map((row) => {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
          row[i] *= 2;
          row[i + 1] = 0;
          this.score += row[i];
        }
      }

      return transformFunc(row);
    });
  }

  spawnTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) =>
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
        // eslint-disable-next-line prettier/prettier
      }));

    if (emptyCells.length > 0) {
      const { rowIndex, colIndex } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameState() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.hasMoves()) {
      this.status = 'lose';
    }
    this.updateUI();
  }

  hasMoves() {
    if (this.board.flat().includes(0)) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && this.board[i][j] === this.board[i + 1][j]) ||
          (j < 3 && this.board[i][j] === this.board[i][j + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  transposeAndMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    const transposed = this.board[0].map((_, colIndex) =>
      // eslint-disable-next-line prettier/prettier
      this.board.map((row) => row[colIndex]));

    const transformed = transposed.map(
      (column) =>
        direction === 'up'
          ? this.mergeAndSlide(column)
          : this.mergeAndSlide(column.reverse()).reverse(),
      // eslint-disable-next-line function-paren-newline
    );

    this.board = transformed[0].map((_, colIndex) =>
      // eslint-disable-next-line prettier/prettier
      transformed.map((row) => row[colIndex]));

    if (JSON.stringify(this.board) !== oldBoard) {
      this.spawnTile();
      this.checkGameState();
    }
  }

  mergeAndSlide(row) {
    const nonZero = row.filter((v) => v !== 0);
    const merged = [];

    let i = 0;

    while (i < nonZero.length) {
      if (nonZero[i] === nonZero[i + 1]) {
        merged.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i += 2;
      } else {
        merged.push(nonZero[i]);
        i++;
      }
    }

    return merged.concat(Array(4 - merged.length).fill(0));
  }

  updateUI() {
    // This method will trigger DOM updates
  }
}

module.exports = Game;
