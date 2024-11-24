/* eslint-disable prettier/prettier */
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
      ? JSON.parse(JSON.stringify(initialState))
      : Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));

    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.board = this.board.map((row) => this.slideAndMerge(row));
    this.finalizeMove();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.board = this.board.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.slideAndMerge(row.reverse()).reverse());

    this.finalizeMove();
  }

  moveUp() {
    this.transpose();
    this.board = this.board.map((row) => this.slideAndMerge(row));
    this.transpose();
    this.finalizeMove();
  }

  moveDown() {
    this.transpose();

    this.board = this.board.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.slideAndMerge(row.reverse()).reverse());
    this.transpose();
    this.finalizeMove();
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
    return JSON.parse(JSON.stringify(this.board));
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
    if (this.status === 'win') {
      return 'win';
    }

    if (this.noMovesLeft()) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateBoard();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
    this.updateBoard();
  }

  // Add your own methods here
  updateBoard() {
    const fieldCells = document.querySelectorAll('.field-cell');

    fieldCells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = this.board[row][col];

      cell.textContent = value === 0 ? '' : value;
      cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
    });
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideAndMerge(row) {
    const nonZero = row.filter((value) => value !== 0);
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

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  transpose() {
    const newBoard = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }

    this.board = newBoard;
  }

  finalizeMove() {
    const previousState = JSON.stringify(this.board);

    this.addRandomTile();
    this.updateBoard();

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (
      this.noMovesLeft() &&
      JSON.stringify(this.board) === previousState
    ) {
      this.status = 'lose';
    }
  }

  noMovesLeft() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
