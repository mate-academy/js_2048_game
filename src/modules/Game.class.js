'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed. *
 */

// Game.class.js

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
    // eslint-disable-next-line no-console
    console.log(this.board);

    this.score = 0;

    if (initialState) {
      this.board = initialState;
    } else {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    }
  }

  moveLeft() {
    this.board = this.board.map((row) => {
      const filteredRow = row.filter(
        (num) => typeof num === 'number' && num !== 0,
      );

      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] = filteredRow[i] * 2;
          this.score += filteredRow[i];
          filteredRow[i + 1] = 0;
        }
      }

      return [
        ...filteredRow.filter((num) => typeof num === 'number' && num !== 0),
        ...Array(
          row.length - filteredRow.filter((num) => num !== 0).length,
        ).fill(0),
      ];
    });
    this.addRandomTile();
  }
  moveRight() {
    this.board = this.board.map((row) => {
      let filteredRow = row.filter(
        (num) => typeof num === 'number' && num !== 0,
      );

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] = filteredRow[i] * 2;
          this.score += filteredRow[i];
          filteredRow[i - 1] = 0;
        }
      }

      filteredRow = filteredRow.filter(
        (num) => typeof num === 'number' && num !== 0,
      );

      return [
        ...Array(row.length - filteredRow.length).fill(0),
        ...filteredRow,
      ];
    });
    this.addRandomTile();
  }

  transpose(matrix) {
    const transposed = [];

    for (let i = 0; i < matrix[0].length; i++) {
      transposed[i] = matrix.map((row) => row[i]);
    }

    return transposed;
  }
  moveUp() {
    const transposedBoard = this.transpose(this.board);

    for (let i = 0; i < transposedBoard.length; i++) {
      let filteredRow = transposedBoard[i].filter(
        (value) => typeof value === 'number' && value !== 0,
      );

      for (let j = 0; j < filteredRow.length; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[i] = filteredRow[i] * 2;
          this.score += filteredRow[i];
          filteredRow[j + 1] = 0;
        }
      }
      filteredRow = filteredRow.filter((num) => num !== 0);

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      transposedBoard[i] = filteredRow;
    }
    this.board = this.transpose(transposedBoard);
    this.addRandomTile();
  }

  moveDown() {
    const transposedBoard = this.transpose(this.board);

    transposedBoard.forEach((row, rowIndex) => {
      let filteredRow = row.filter(
        (value) => typeof value === 'number' && value !== 0,
      );

      for (let j = filteredRow.length - 1; j > 0; j--) {
        if (filteredRow[j] === filteredRow[j - 1]) {
          filteredRow[j] = filteredRow[j] * 2;
          this.score += filteredRow[j];
          filteredRow[j - 1] = 0;
        }
      }

      filteredRow = filteredRow.filter(
        (num) => typeof num === 'number' && num !== 0,
      );

      while (filteredRow.length < 4) {
        filteredRow.unshift(0);
      }
      transposedBoard[rowIndex] = filteredRow;
    });

    this.board = this.transpose(transposedBoard);
    this.addRandomTile();
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
  hasAvailableMoves() {
    for (const row of this.board) {
      if (row.includes(0)) {
        return true;
      }
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < this.board.length - 1; i++) {
      for (let j = 0; this.board[i].length; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
  getStatus() {
    if (this.board.flat().includes(2048)) {
      return `win`;
    }

    if (!this.hasAvailableMoves()) {
      return 'lose';
    }

    return this.board.flat().some((value) => value !== 0) ? 'playing' : 'idle';
  }

  /**
   * Starts the game.
   */
  addRandomTile() {
    const emptyTiles = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          emptyTiles.push({ row: r, col: c });
        }
      }
    }

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { row, col } = emptyTiles[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    this.board = this.board.map(
      (r) => r.map((value) => (typeof value === 'number' ? value : 0)), // eslint-disable-line
    );
  }

  renderBoard() {
    const rows = document.querySelectorAll('.field-row');

    this.board.forEach((row, rowIndex) => {
      const cells = rows[rowIndex].querySelectorAll('.field-cell');

      row.forEach((cell, colIndex) => {
        const cellElement = cells[colIndex];

        cellElement.textContent = '';

        if (cell !== 0) {
          cellElement.textContent = cell;
          cellElement.className = `field-cell field-cell--${cell}`;
        } else {
          cellElement.className = 'field-cell';
        }
      });
    });
  }

  start() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
    this.renderBoard();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}
