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
  constructor(initialState) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array(4)
      .fill()
      .map(() => Array(4).fill(0));
  }

  moveLeft() {
    let moved = false;

    for (const row of this.board) {
      const newRow = this.merge(this.slide(row));

      if (!this.arraysEqual(row, newRow)) {
        moved = true;
      }
      Object.assign(row, newRow);
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveRight() {
    let moved = false;

    for (const row of this.board) {
      const reversedRow = row.slice().reverse();
      const newRow = this.merge(this.slide(reversedRow)).reverse();

      if (!this.arraysEqual(row, newRow)) {
        moved = true;

        Object.assign(row, newRow);
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = this.getColumn(col);
      const newColumn = this.merge(this.slide(column));

      if (!this.arraysEqual(column, newColumn)) {
        moved = true;
        this.setColumn(col, newColumn);
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = this.getColumn(col).reverse();
      const newColumn = this.merge(this.slide(column)).reverse();

      if (!this.arraysEqual(column, newColumn)) {
        moved = true;
        this.setColumn(col, newColumn);
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  getColumn(index) {
    const column = [];

    for (let row = 0; row < 4; row++) {
      column.push(this.board[row][index]);
    }

    return column;
  }

  setColumn(index, newColumn) {
    for (let row = 0; row < 4; row++) {
      this.board[row][index] = newColumn[row];
    }
  }

  slide(row) {
    const newRow = row.filter((value) => value !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  merge(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return this.slide(row);
  }

  arraysEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
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
    if (this.board.some((row) => row.includes(2048))) {
      return 'win';
    }

    const hasMoves = this.board.some((row, rowIndex) =>
      row.some((value, colIndex) => {
        if (value === 0) {
          return true;
        }

        if (colIndex < 3 && value === row[colIndex + 1]) {
          return true;
        }

        if (rowIndex < 3 && value === this.board[rowIndex + 1][colIndex]) {
          return true;
        }

        return false;
      }),
    );

    if (!hasMoves) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row: newRow, col: newCol } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[newRow][newCol] = Math.random() < 0.9 ? 2 : 4;
    }
  }
}
module.exports = Game;
