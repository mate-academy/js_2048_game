/* eslint-disable function-paren-newline */
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
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.dim = 4;
    this.twoProbability = 0.9;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const needsTranspose = direction === 'up' || direction === 'down';
    const swipeDirection =
      direction === 'up' || direction === 'left' ? 'left' : 'right';
    const newState = this.state.map((row) => [...row]);
    let matrix = newState;

    if (needsTranspose) {
      matrix = this.transpose(newState);
    }

    const didSwipe = this.swipeRows(swipeDirection, matrix);
    const didMerge = this.combineRows(swipeDirection, matrix);

    if (didMerge) {
      this.swipeRows(swipeDirection, matrix);
    }

    if (didSwipe || didMerge) {
      if (needsTranspose) {
        this.state = this.transpose(matrix);
      } else {
        this.state = matrix;
      }

      this.generate();
      this.checkStatus();

      return true;
    }

    return false;
  }

  swipeRows(direction = 'left', matrix = this.state) {
    let isChanged = false;

    for (const row of matrix) {
      const filteredRow = row.filter((num) => num);
      const missing = this.dim - filteredRow.length;
      const zeros = Array(missing).fill(0);
      const newRow =
        direction === 'left'
          ? filteredRow.concat(zeros)
          : zeros.concat(filteredRow);

      if (row.toString() !== newRow.toString()) {
        isChanged = true;

        for (let i = 0; i < this.dim; i++) {
          row[i] = newRow[i];
        }
      }
    }

    return isChanged;
  }

  combineRows(direction = 'left', matrix = this.state) {
    let isChanged = false;

    for (const row of matrix) {
      if (direction === 'left') {
        for (let i = 0; i < this.dim; i++) {
          if (row[i] !== 0 && row[i] === row[i + 1]) {
            if (row[i] === 1024) {
              this.status = 'win';
            }
            isChanged = true;
            row[i] *= 2;
            row[i + 1] = 0;
            this.score += row[i];
            i++;
          }
        }
      } else {
        for (let i = this.dim - 1; i >= 0; i--) {
          if (row[i] !== 0 && row[i] === row[i - 1]) {
            if (row[i] === 1024) {
              this.status = 'win';
            }
            isChanged = true;
            row[i] *= 2;
            row[i - 1] = 0;
            this.score += row[i];
            i--;
          }
        }
      }
    }

    return isChanged;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  generate() {
    const emptyCells = [];

    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < this.twoProbability ? 2 : 4;

    return true;
  }

  checkStatus() {
    const hasEmptyCell = this.state.some((row) => row.includes(0));
    const hasMergeableCells = this.state.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        if (colIndex < this.dim - 1 && cell === row[colIndex + 1]) {
          return true;
        }

        if (
          rowIndex < this.dim - 1 &&
          cell === this.state[rowIndex + 1][colIndex]
        ) {
          return true;
        }

        return false;
      });
    });

    if (!hasEmptyCell && !hasMergeableCells) {
      this.status = 'lose';
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
    return this.state;
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
    this.generate();
    this.generate();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.state = this.initialState.map((row) => [...row]);
  }
}

module.exports = Game;
