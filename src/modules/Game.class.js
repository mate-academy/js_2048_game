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
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    return this.move(this.board);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    this.board = this.board.map((row) => row.reverse());

    const changed = this.move(this.board);

    this.board = this.board.map((row) => row.reverse());

    return changed;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    this.transpose();

    const changed = this.move(this.board);

    this.transpose();

    return changed;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    this.transpose();
    this.board = this.board.map((row) => row.reverse());

    const changed = this.move(this.board);

    this.board = this.board.map((row) => row.reverse());
    this.transpose();

    return changed;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.generateRandomTile();
      this.generateRandomTile();
    }
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;
  }

  move(board) {
    let changed = false;
    let gainedScore = 0;

    for (let i = 0; i < 4; i++) {
      const [newRow, rowChanged, rowScore] = this.slideAndMergeRow(board[i]);

      if (rowChanged) {
        changed = true;
      }

      gainedScore += rowScore;
      board[i] = newRow;
    }

    if (changed) {
      this.score += gainedScore;
      this.generateRandomTile();
      this.checkGameStatus();
    }

    return changed;
  }

  slideAndMergeRow(row) {
    const nonZero = row.filter((val) => val !== 0);
    const newRow = [];

    let scoreGain = 0;
    let skip = false;

    for (let i = 0; i < nonZero.length; i++) {
      if (!skip && nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        newRow.push(merged);

        scoreGain += merged;

        if (merged === 2048) {
          this.hasWon = true;
        }
        skip = true;
      } else if (skip) {
        skip = false;
      } else {
        newRow.push(nonZero[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    const changed = row.some((v, idx) => v !== newRow[idx]);

    return [newRow, changed, scoreGain];
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  generateRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [randRow, randCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[randRow][randCol] = value;
  }

  checkGameStatus() {
    if (this.hasWon) {
      this.status = 'win';

      return;
    }

    const movesAvailable =
      this.board.some((row) => row.includes(0)) || this.canMerge();

    if (!movesAvailable) {
      this.status = 'lose';
    }
  }

  canMerge() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
