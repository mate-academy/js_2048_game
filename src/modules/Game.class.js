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
    this.setBoard = JSON.parse(JSON.stringify(initialState));
    this.board = JSON.parse(JSON.stringify(initialState));
    this.score = 0;
    this.status = Game.IDLE;
  }

  moveLeft() {
    if (this.canMoveLeft() && this.status === Game.PLAYING) {
      for (let r = 0; r < Game.ROWS; r++) {
        let rowCurrent = this.board[r];

        rowCurrent = this.slide(rowCurrent);

        this.board[r] = rowCurrent;
      }

      this.setTwo();
      this.checkLose();
      this.checkWin();

      return true;
    }

    return false;
  }

  moveRight() {
    if (this.canMoveRight() && this.status === Game.PLAYING) {
      for (let r = 0; r < Game.ROWS; r++) {
        let rowCurrent = this.board[r];

        rowCurrent.reverse();

        rowCurrent = this.slide(rowCurrent);

        this.board[r] = rowCurrent.reverse();
      }

      this.setTwo();
      this.checkLose();
      this.checkWin();

      return true;
    }

    return false;
  }

  moveUp() {
    if (this.canMoveUp() && this.status === Game.PLAYING) {
      for (let c = 0; c < Game.COLUMNS; c++) {
        let rowCurrent = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];

        rowCurrent = this.slide(rowCurrent);

        for (let r = 0; r < Game.ROWS; r++) {
          this.board[r][c] = rowCurrent[r];
        }
      }

      this.setTwo();
      this.checkLose();
      this.checkWin();

      return true;
    }

    return false;
  }

  moveDown() {
    if (this.canMoveDown() && this.status === Game.PLAYING) {
      for (let c = 0; c < Game.COLUMNS; c++) {
        let rowCurrent = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];

        rowCurrent.reverse();
        rowCurrent = this.slide(rowCurrent);
        rowCurrent.reverse();

        for (let r = 0; r < Game.ROWS; r++) {
          this.board[r][c] = rowCurrent[r];
        }
      }

      this.setTwo();
      this.checkLose();
      this.checkWin();

      return true;
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
    this.setTwo();
    this.setTwo();
    this.status = Game.PLAYING;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.board = JSON.parse(JSON.stringify(this.setBoard));
    this.status = Game.IDLE;
  }

  setTwo() {
    // check empty cell
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;
    let r = 0;
    let c = 0;
    let num = 0;

    while (!found) {
      // find random row and column to place a 2 and 4 in

      r = Math.floor(Math.random() * Game.ROWS);
      c = Math.floor(Math.random() * Game.COLUMNS);

      if (this.board[r][c] === 0) {
        num = Math.random() > 0.1 ? 2 : 4;

        this.board[r][c] = num;

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

  filterZero(array) {
    return array.filter((num) => num !== 0);
  }

  slide(rowCurrent) {
    let row = rowCurrent;

    row = this.filterZero(rowCurrent);

    if (row.length === 0) {
      return [0, 0, 0, 0];
    }

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    row = this.filterZero(row);

    while (row.length < Game.ROWS) {
      row.push(0);
    }

    return row;
  }

  checkWin() {
    for (let r = 0; r < Game.ROWS; r++) {
      for (let c = 0; c < Game.COLUMNS; c++) {
        if (this.board[r][c] === 2048) {
          this.status = Game.WIN;
        }
      }
    }
  }

  checkLose() {
    // if no empty cell and u cant move left right down up
    const arrayOfConditions = [
      this.hasEmptyTile(),
      this.canMoveLeft(),
      this.canMoveRight(),
      this.canMoveUp(),
      this.canMoveDown(),
    ];

    if (arrayOfConditions.indexOf(true) === -1) {
      this.status = Game.LOSE;
    }
  }

  canMoveLeft() {
    for (let r = 0; r < Game.ROWS; r++) {
      const row1 = Array.from(this.board[r]);
      const row2 = this.canSlide(row1);

      // if two rows not the same
      // thant mean one of the tile was moved and we can make a move
      if (!this.isArrayTheSame(row1, row2)) {
        return true;
      }
    }

    // if they all same nothing changes
    return false;
  }

  canMoveRight() {
    for (let r = 0; r < Game.ROWS; r++) {
      const row1 = Array.from(this.board[r]);
      const row2 = this.canSlide(row1.reverse());

      if (!this.isArrayTheSame(row1, row2)) {
        return true;
      }
    }

    return false;
  }

  canMoveUp() {
    for (let c = 0; c < Game.COLUMNS; c++) {
      const row = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      const row1 = Array.from(row);
      const row2 = this.canSlide([...row1]);

      if (!this.isArrayTheSame(row1, row2)) {
        return true;
      }
    }

    return false;
  }

  canMoveDown() {
    for (let c = 0; c < Game.COLUMNS; c++) {
      const row = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      const row1 = Array.from(row);
      const row2 = this.canSlide([...row1].reverse()).reverse();

      if (!this.isArrayTheSame(row1, row2)) {
        return true;
      }
    }

    return false;
  }

  isArrayTheSame(row1, row2) {
    for (let i = 0; i < row1.length; i++) {
      if (row1[i] !== row2[i]) {
        return false;
      }
    }

    return true;
  }

  canSlide(rowCurrent) {
    let row = rowCurrent;

    row = this.filterZero(rowCurrent);

    if (row.length === 0) {
      return [0, 0, 0, 0];
    }

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }

    row = this.filterZero(row);

    while (row.length < Game.ROWS) {
      row.push(0);
    }

    return row;
  }
}

module.exports = Game;
