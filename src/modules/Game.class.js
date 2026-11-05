'use strict';

const BOARD_SIZE = 4;
const WINNING_VALUE = 2048;
const FOUR_PROBABILITY = 0.1;

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
  constructor(initialState = Game.createEmptyBoard()) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  static createEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
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

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    let gained = 0;

    const slide = (row) => {
      const { row: mergedRow, gain } = this.mergeRow(row);

      gained += gain;

      return mergedRow;
    };

    const slideReversed = (row) => [...slide([...row].reverse())].reverse();

    let newBoard;

    switch (direction) {
      case 'left':
        newBoard = this.board.map(slide);
        break;
      case 'right':
        newBoard = this.board.map(slideReversed);
        break;
      case 'up':
        newBoard = this.transpose(this.transpose(this.board).map(slide));
        break;
      case 'down':
        newBoard = this.transpose(
          this.transpose(this.board).map(slideReversed),
        );
        break;
      default:
        return;
    }

    if (this.boardsEqual(this.board, newBoard)) {
      return;
    }

    this.board = newBoard;
    this.score += gained;
    this.addRandomTile();
    this.updateStatus();
  }

  mergeRow(row) {
    const values = row.filter((cell) => cell !== 0);
    const merged = [];
    let gain = 0;

    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        const mergedValue = values[i] * 2;

        merged.push(mergedValue);
        gain += mergedValue;
        i++;
      } else {
        merged.push(values[i]);
      }
    }

    while (merged.length < BOARD_SIZE) {
      merged.push(0);
    }

    return { row: merged, gain };
  }

  transpose(board) {
    return board[0].map((_, col) => board.map((row) => row[col]));
  }

  boardsEqual(a, b) {
    return a.every((row, i) => row.every((cell, j) => cell === b[i][j]));
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < FOUR_PROBABILITY ? 4 : 2;
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(WINNING_VALUE))) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < BOARD_SIZE - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < BOARD_SIZE - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
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
  }
}

module.exports = Game;
