'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
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
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.width = 4;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const cell = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[cell.row][cell.col] = value;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);
    let scoreGained = 0;

    const isVertical = direction === 'up' || direction === 'down';

    const board = isVertical
      ? this.board[0].map((_, col) => this.board.map((row) => row[col]))
      : this.board.map((row) => [...row]);

    for (let i = 0; i < board.length; i++) {
      const row = [...board[i]];

      if (direction === 'right' || direction === 'down') {
        row.reverse();
      }

      const numbers = row.filter((number) => number !== 0);
      const merged = [];

      for (let j = 0; j < numbers.length; j++) {
        if (numbers[j] === numbers[j + 1]) {
          const value = numbers[j] * 2;

          merged.push(value);
          scoreGained += value;
          j++;
        } else {
          merged.push(numbers[j]);
        }
      }

      const missing = this.width - merged.length;
      const newRow = merged.concat(Array(missing).fill(0));

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }

      board[i] = newRow;
    }

    this.board = isVertical
      ? board[0].map((_, col) => board.map((row) => row[col]))
      : board;

    const changed = this.board.some((row, i) => {
      return row.some((value, j) => value !== oldBoard[i][j]);
    });

    if (!changed) {
      return;
    }

    this.score += scoreGained;
    this.addRandomTile();

    if (this.hasWon()) {
      this.status = 'win';
    } else if (this.hasLost()) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
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
    return this.board.map((row) => [...row]);
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
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  hasWon() {
    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  hasLost() {
    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === 0) {
          return false;
        }

        if (j < row.length - 1 && row[j] === row[j + 1]) {
          return false;
        }

        if (i < this.board.length - 1 && row[j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }
}
