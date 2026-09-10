'use strict';

const ROWS = 4;
const COLS = 4;
const WINNING_VALUE = 2048;
const FOUR_PROBABILITY = 0.1;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}
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
  constructor(initialState = createEmptyBoard()) {
    this.initialState = cloneBoard(initialState);
    this.state = cloneBoard(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move((row) => this.slideRow(row));
  }
  moveRight() {
    this.move((row) => {
      const { row: mergedRow, scoreGained } = this.slideRow([...row].reverse());

      return { row: mergedRow.reverse(), scoreGained };
    });
  }

  moveUp() {
    this.moveVertical((column) => this.slideRow(column));
  }

  moveDown() {
    this.moveVertical((column) => {
      const { row: mergedColumn, scoreGained } = this.slideRow(
        [...column].reverse(),
      );

      return { row: mergedColumn.reverse(), scoreGained };
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
    return cloneBoard(this.state);
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
    this.state = cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  slideRow(line) {
    const values = line.filter((cell) => cell !== 0);
    let scoreGained = 0;

    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] === values[i + 1]) {
        values[i] *= 2;
        scoreGained += values[i];
        values.splice(i + 1, 1);
      }
    }

    while (values.length < COLS) {
      values.push(0);
    }

    return { row: values, scoreGained };
  }

  move(transform) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = cloneBoard(this.state);
    let scoreGained = 0;

    this.state = this.state.map((row) => {
      const result = transform(row);

      scoreGained += result.scoreGained;

      return result.row;
    });

    this.finishMove(previousState, scoreGained);
  }

  moveVertical(transform) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = cloneBoard(this.state);
    const transposed = this.transpose(this.state);
    let scoreGained = 0;

    const mergedTransposed = transposed.map((column) => {
      const result = transform(column);

      scoreGained += result.scoreGained;

      return result.row;
    });

    this.state = this.transpose(mergedTransposed);
    this.finishMove(previousState, scoreGained);
  }

  finishMove(previousState, scoreGained) {
    const hasChanged =
      JSON.stringify(previousState) !== JSON.stringify(this.state);

    if (!hasChanged) {
      return;
    }

    this.score += scoreGained;
    this.addRandomTile();
    this.updateStatus();
  }

  transpose(board) {
    return board[0].map((_col, colIndex) => board.map((row) => row[colIndex]));
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, emptyRowIndex) => {
      row.forEach((cell, emptyColIndex) => {
        if (cell === 0) {
          emptyCells.push([emptyRowIndex, emptyColIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [rowIndex, colIndex] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[rowIndex][colIndex] = Math.random() < FOUR_PROBABILITY ? 4 : 2;
  }

  updateStatus() {
    const hasWinningTile = this.state.some((row) => {
      return row.includes(WINNING_VALUE);
    });

    if (hasWinningTile) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
      for (let colIndex = 0; colIndex < COLS; colIndex++) {
        const current = this.state[rowIndex][colIndex];

        if (current === 0) {
          return true;
        }

        const right = this.state[rowIndex][colIndex + 1];
        const below = this.state[rowIndex + 1]
          ? this.state[rowIndex + 1][colIndex]
          : undefined;

        if (current === right || current === below) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
