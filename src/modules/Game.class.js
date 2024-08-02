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
  static ROWS = 4;
  static COLUMNS = 4;
  static IDLE = 'idle';
  static PLAYING = 'playing';
  static WIN = 'win';
  static LOSE = 'lose';

  static getInitialStateDefault() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  constructor(initialState = Game.getInitialStateDefault()) {
    this.setBoard = structuredClone(initialState);
    this.board = structuredClone(initialState);
    this.score = 0;
    this.status = Game.IDLE;

    // eslint-disable-next-line no-console
    console.log('board', this.board);
  }

  moveLeft() {
    for (let r = 0; r < Game.ROWS; r++) {
      let rowCurrent = this.board[r];

      rowCurrent = this.slide(rowCurrent);
      document.querySelector('.game-score').innerText = this.score;

      this.board[r] = rowCurrent;

      for (let c = 0; c < Game.COLUMNS; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.board[r][c];

        this.updateCell(tile, num);
      }
    }
  }

  moveRight() {
    for (let r = 0; r < this.rows; r++) {
      let rowCurrent = this.board[r];

      rowCurrent.reverse();

      rowCurrent = this.slide(rowCurrent);

      this.board[r] = rowCurrent.reverse();

      document.querySelector('.game-score').innerText = this.score;

      for (let c = 0; c < this.columns; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.board[r][c];

        this.updateTile(tile, num);
      }
    }
  }
  moveUp() {}
  moveDown() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.setTheBoard();
    this.setTwo();
    this.setTwo();
    this.status = Game.PLAYING;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.board = structuredClone(this.setBoard);
    this.status = Game.IDLE;

    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell) => {
      cell.innerText = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');
    });
  }

  updateCell(cell, value) {
    cell.innerText = '';
    cell.classList.value = '';
    cell.classList.add('field-cell');

    if (value > 0) {
      cell.innerText = value.toString();
      cell.classList.add('field-cell--' + value.toString());
    }
  }

  setTwo() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      // find random row and column to place a 2 and 4 in

      const r = Math.floor(Math.random() * Game.ROWS);
      const c = Math.floor(Math.random() * Game.COLUMNS);

      if (this.board[r][c] === 0) {
        const num = Math.random() > 0.1 ? 2 : 4;

        this.board[r][c] = num;

        const tile = document.getElementById(r.toString() + '-' + c.toString());

        tile.innerText = num.toString();

        if (num === 2) {
          tile.classList.add('field-cell--2');
        } else {
          tile.classList.add('field-cell--4');
        }
        found = true;
      }
    }
  }

  hasEmptyTile() {
    for (let r = 0; r < Game.ROWS; r++) {
      for (let c = 0; c < Game.COLUMNS; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  setTheBoard() {
    for (let r = 0; r < Game.ROWS; r++) {
      for (let c = 0; c < Game.COLUMNS; c++) {
        const value = this.setBoard[r][c];
        const tile = document.getElementById(r.toString() + '-' + c.toString());

        this.updateCell(tile, value);
      }
    }
  }

  filterZero(array) {
    return array.filter((num) => num !== 0);
  }

  slide(rowCurrent) {
    let row = this.filterZero(rowCurrent);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    row = this.filterZero(row);

    while (row.length < this.columns) {
      row.push(0);
    }

    return row;
  }
}

module.exports = Game;
