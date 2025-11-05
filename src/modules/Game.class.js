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
    // eslint-disable-next-line no-console
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : null;

    this.board =
      initialState ??
      Array(4)
        .fill()
        .map(() => Array(4).fill(0))
        .map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }

  slideAndMerge(row) {
    let nonEmpty = row.filter((cell) => cell !== 0);

    for (let i = 0; i < nonEmpty.length - 1; i++) {
      if (nonEmpty[i] === nonEmpty[i + 1]) {
        nonEmpty[i] *= 2;
        this.score += nonEmpty[i];
        nonEmpty[i + 1] = 0;
      }
    }
    nonEmpty = nonEmpty.filter((cell) => cell !== 0);

    while (nonEmpty.length < 4) {
      nonEmpty.push(0);
    }

    return nonEmpty;
  }

  stackLine(line) {
    const nonEmpty = line.filter((cell) => cell !== 0);

    while (nonEmpty.length < 4) {
      nonEmpty.push(0);
    }

    return nonEmpty;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let i = 0; i < this.board.length; i++) {
      const originalRow = [...this.board[i]];
      let newRow = this.stackLine(originalRow);

      newRow = this.slideAndMerge(newRow);
      newRow = this.stackLine(newRow);

      const isRowChanged = !newRow.every(
        (cell, index) => cell === originalRow[index],
      );

      if (!hasChanged && isRowChanged) {
        hasChanged = true;
      }

      this.board[i] = newRow;
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkWin();

    this.checkLose();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let i = 0; i < this.board.length; i++) {
      const originalRow = [...this.board[i]];
      let reversed = [...originalRow].reverse();

      reversed = this.slideAndMerge(reversed);

      const newRow = reversed.reverse();
      const isRowChanged = !newRow.every(
        (cell, index) => cell === originalRow[index],
      );

      if (!hasChanged && isRowChanged) {
        hasChanged = true;
      }

      this.board[i] = newRow;
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkWin();

    this.checkLose();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let j = 0; j < this.board.length; j++) {
      const column = this.board.map((row) => row[j]);
      const originalColumn = [...column];
      const newColumn = this.slideAndMerge(column);
      const isColumnChanged = !newColumn.every(
        (cell, index) => cell === originalColumn[index],
      );

      if (!hasChanged && isColumnChanged) {
        hasChanged = true;
      }

      for (let i = 0; i < this.board.length; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkWin();

    this.checkLose();
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let j = 0; j < this.board.length; j++) {
      let column = this.board.map((row) => row[j]);
      const originalColumn = [...column];

      column = column.reverse();
      column = this.slideAndMerge(column);
      column = column.reverse();

      const isColumnChanged = !column.every(
        (cell, index) => cell === originalColumn[index],
      );

      if (!hasChanged && isColumnChanged) {
        hasChanged = true;
      }

      for (let i = 0; i < this.board.length; i++) {
        this.board[i][j] = column[i];
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkWin();

    this.checkLose();
  }

  checkWin() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkLose() {
    if (this.status === 'win') {
      return;
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === 0) {
          return;
        }

        if (
          j + 1 < this.board.length &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return;
        }

        if (
          i + 1 < this.board.length &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return;
        }
      }
    }
    this.status = 'lose';
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  addRandomTile() {
    const emptyCells = [];

    for (let rows = 0; rows < this.board.length; rows++) {
      for (let columns = 0; columns < this.board[rows].length; columns++) {
        if (this.board[rows][columns] === 0) {
          emptyCells.push([rows, columns]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, column] = emptyCells[randomIndex];

    this.board[row][column] = Math.random() < 0.9 ? 2 : 4;
  }

  start() {
    if (!this.board || this.board.flat().every((cell) => cell === 0)) {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board =
      this.initialState ??
      Array(4)
        .fill()
        .map(() => Array(4).fill(0))
        .map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }
}

// Add your own methods here

module.exports = Game;
