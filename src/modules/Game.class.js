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
    if (initialState === undefined) {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    } else {
      this.board = initialState.map((row) => [...row]);
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing' && this.status !== 'win') {
      return;
    }

    const boardBefore = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = this.slideAndMerge(this.board[i]);
    }

    this.lostAndChangesOnAfterMove(boardBefore);
  }

  moveRight() {
    if (this.status !== 'playing' && this.status !== 'win') {
      return;
    }

    const boardBefore = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      const reversedRow = [...this.board[i]].reverse();
      const backToRight = this.slideAndMerge(reversedRow).reverse();

      this.board[i] = backToRight;
    }

    this.lostAndChangesOnAfterMove(boardBefore);
  }

  moveUp() {
    if (this.status !== 'playing' && this.status !== 'win') {
      return;
    }

    const boardBefore = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      const column = [];

      for (let j = 0; j < this.board.length; j++) {
        column.push(this.board[j][i]);
      }

      const processed = this.slideAndMerge(column);

      for (let j = 0; j < this.board.length; j++) {
        this.board[j][i] = processed[j];
      }
    }

    this.lostAndChangesOnAfterMove(boardBefore);
  }

  moveDown() {
    if (this.status !== 'playing' && this.status !== 'win') {
      return;
    }

    const boardBefore = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      const column = [];

      for (let j = 0; j < this.board.length; j++) {
        column.push(this.board[j][i]);
      }

      const processed = this.slideAndMerge(column.reverse()).reverse();

      for (let j = 0; j < this.board.length; j++) {
        this.board[j][i] = processed[j];
      }
    }

    this.lostAndChangesOnAfterMove(boardBefore);
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
  start() {
    this.status = 'playing';

    if (this.getEmptyCells().length === 16) {
      this.addRandomBlock();
      this.addRandomBlock();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.clearTheBoard();
    this.score = 0;
    this.start();
  }

  // Add your own methods here

  addRandomBlock() {
    const rowsAndColumns = this.getEmptyCells();

    if (rowsAndColumns.length >= 1) {
      const randomIndex = Math.floor(Math.random() * rowsAndColumns.length);
      const ratio = Math.random() * 100;
      const el = rowsAndColumns[randomIndex];

      if (ratio > 90) {
        this.board[el[0]][el[1]] = 4;
      } else {
        this.board[el[0]][el[1]] = 2;
      }
    }
  }

  getEmptyCells() {
    const rowsAndColumns = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === 0) {
          rowsAndColumns.push([i, j]);
        }
      }
    }

    return rowsAndColumns;
  }

  clearTheBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  slideAndMerge(row) {
    const filtered = row.filter((el) => el !== 0);
    const merged = [];

    for (let j = 0; j < filtered.length; j++) {
      const cur = filtered[j];
      const next = filtered[j + 1];

      if (cur === next) {
        merged.push(cur + next);
        this.score += cur + next;

        if (cur + next === 2048) {
          this.status = 'win';
        }
        j++;
      } else {
        merged.push(cur);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  checkChanges(boardBefore) {
    const boardAfter = JSON.stringify(this.board);

    if (boardBefore !== boardAfter) {
      return true;
    }

    return false;
  }

  isGameLost() {
    if (this.getEmptyCells().length > 0) {
      return false;
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (this.board[j][i] === this.board[j + 1][i]) {
          return false;
        }
      }
    }

    return true;
  }

  lostAndChangesOnAfterMove(boardBefore) {
    if (this.checkChanges(boardBefore)) {
      this.addRandomBlock();

      if (this.status !== 'win' && this.isGameLost()) {
        this.status = 'lose';
      }
    }
  }
}

module.exports = Game;
