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
    this.rows = 4;
    this.columns = 4;
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = initialState;
    } else {
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  moveLeft() {
    for (let row = 0; row < this.rows; row++) {
      const newRow = this.board[row].filter((val) => val !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      const finalRow = newRow.filter((val) => val !== 0);

      while (finalRow.length < this.columns) {
        finalRow.push(0);
      }

      this.board[row] = finalRow;
    }

    this.renderBoard();
    this.addRandomTile();
    this.checkGameStatus();
  }

  moveRight() {
    for (let row = 0; row < this.rows; row++) {
      const reversedRow = this.board[row].reverse();

      const newRow = reversedRow.filter((val) => val !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      const finalRow = newRow.filter((val) => val !== 0);

      while (finalRow.length < this.columns) {
        finalRow.push(0);
      }

      this.board[row] = finalRow.reverse();
    }

    this.renderBoard();
    this.addRandomTile();
    this.checkGameStatus();
  }

  moveUp() {
    this.board = this.transpose(this.board);

    for (let row = 0; row < this.rows; row++) {
      const newColumn = this.board[row].filter((val) => val !== 0);

      for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          newColumn[i] *= 2;
          this.score += newColumn[i];
          newColumn[i + 1] = 0;
        }
      }

      const finalColumn = newColumn.filter((val) => val !== 0);

      while (finalColumn.length < this.rows) {
        finalColumn.push(0);
      }

      this.board[row] = finalColumn;
    }

    this.board = this.transpose(this.board);

    this.renderBoard();
    this.addRandomTile();
    this.checkGameStatus();
  }

  moveDown() {
    this.board = this.transpose(this.board);

    for (let row = 0; row < this.rows; row++) {
      const newColumn = this.board[row].filter((val) => val !== 0);

      for (let i = newColumn.length - 1; i > 0; i--) {
        if (newColumn[i] === newColumn[i - 1]) {
          newColumn[i] *= 2;
          this.score += newColumn[i];
          newColumn[i - 1] = 0;
        }
      }

      const finalColumn = newColumn.filter((val) => val !== 0);

      while (finalColumn.length < this.rows) {
        finalColumn.unshift(0);
      }

      this.board[row] = finalColumn;
    }

    this.board = this.transpose(this.board);

    this.renderBoard();

    this.addRandomTile();

    this.checkGameStatus();
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
    return {
      board: this.board,
      score: this.score,
      status: this.status,
    };
  }

  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
      this.renderBoard();
    } else if (this.status === 'win' || this.status === 'lose') {
      this.status = 'playing';
      this.score = 0;
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
      this.renderBoard();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.renderBoard();

    const scoreEl = document.querySelector('.game-score');

    if (scoreEl) {
      scoreEl.textContent = this.score;
    }

    document.querySelector('.message-lose')?.classList.add('hidden');
    document.querySelector('.message-win')?.classList.add('hidden');
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < this.rows; i++) {
      board.push(new Array(this.columns).fill(0));
    }

    return board;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  renderBoard() {
    const fieldCells = document.querySelectorAll('.field-cell');
    let cellIndex = 0;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const cellValue = this.board[row][col];
        const cell = fieldCells[cellIndex];

        if (cellValue > 0) {
          cell.textContent = cellValue;
          cell.className = `field-cell field-cell--${cellValue}`;
        } else {
          cell.textContent = '';
          cell.className = 'field-cell';
        }
        cellIndex++;
      }
    }
  }

  transpose(matrix) {
    const transposed = [];

    for (let col = 0; col < this.columns; col++) {
      const newRow = [];

      for (let row = 0; row < this.rows; row++) {
        newRow.push(matrix[row][col]);
      }
      transposed.push(newRow);
    }

    return transposed;
  }

  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
      this.renderBoard();

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
      this.renderBoard();
    }
  }

  hasAvailableMoves() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (
          this.board[row][col] === this.board[row + 1]?.[col] ||
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
