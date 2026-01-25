'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

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
    const defaultBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = clone(initialState || defaultBoard);
    this.board = clone(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.executeMove(() => {
      this.board = this.board.map((row) => this.slideAndMerge(row));
    });
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.executeMove(() => {
      this.board = this.board.map((row) => {
        const reversedRow = [...row].reverse();
        const merged = this.slideAndMerge(reversedRow);

        return merged.reverse();
      });
    });
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.executeMove(() => {
      let tempBoard = this.transpose(this.board);

      tempBoard = tempBoard.map((row) => this.slideAndMerge(row));
      this.board = this.transpose(tempBoard);
    });
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.executeMove(() => {
      let tempBoard = this.transpose(this.board);

      tempBoard = tempBoard.map((row) => {
        const reversedRow = [...row].reverse();
        const merged = this.slideAndMerge(reversedRow);

        return merged.reverse();
      });

      this.board = this.transpose(tempBoard);
    });
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
    return clone(this.board);
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
    this.board = clone(this.initialState);
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
    this.score = 0;
  }

  /**
   * Resets the game.
   */
  restart(newInitialState) {
    if (newInitialState) {
      this.initialState = clone(newInitialState);
    }

    this.board = clone(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      const value = Math.random() < 0.9 ? 2 : 4;

      this.board[randomCell.r][randomCell.c] = value;
    }
  }

  slideAndMerge(row) {
    const filtered = row.filter((num) => num > 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const newValue = filtered[i] * 2;

        if (newValue === 2048) {
          this.status = 'win';
        }

        result.push(newValue);
        this.score += newValue;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  executeMove(callback) {
    const boardBefore = JSON.stringify(this.board);

    callback();

    if (JSON.stringify(this.board) !== boardBefore) {
      this.addRandomTile();

      if (this.status !== 'win' && !this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        } else if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
