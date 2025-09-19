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
    console.log(initialState);

    this.score = 0;
    this.status = 'idle';
    this.size = 4;

    this.tokens = [];

    for (let i = 0; i < 4; i++) {
      this.tokens[i] = Array(this.size).fill(0);
    }

    this.board = initialState || this.tokens;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let notEmpty = this.board.map((row) => row.filter((n) => n > 0));

    notEmpty.forEach((row) => {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;

          this.score += row[i];
          row[i + 1] = 0;
        }
      }
    });

    notEmpty = notEmpty.map((row) => row.filter((n) => n > 0));

    for (const row of notEmpty) {
      while (row.length < this.size) {
        row.push(0);
      }
    }

    const untill = JSON.stringify(this.board);

    this.board = notEmpty;

    const afterr = JSON.stringify(this.board);

    this.lose(untill, afterr);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let notEmpty = this.board.map((row) => row.filter((n) => n > 0));

    notEmpty.forEach((row) => {
      for (let i = row.length - 1; i > 0; i--) {
        if (row[i] === row[i - 1]) {
          row[i] *= 2;

          this.score += row[i];
          row[i - 1] = 0;
        }
      }
    });

    notEmpty = notEmpty.map((row) => row.filter((n) => n > 0));

    for (const row of notEmpty) {
      while (row.length < this.size) {
        row.unshift(0);
      }
    }

    const untill = JSON.stringify(this.board);

    this.board = notEmpty;

    const afterr = JSON.stringify(this.board);

    this.lose(untill, afterr);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let notEmpty = [];

    for (let col = 0; col < this.size; col++) {
      const colArray = [];

      for (let row = 0; row < this.size; row++) {
        colArray.push(this.board[row][col]);
      }

      notEmpty.push(colArray);
    }

    notEmpty = notEmpty.map((col) => col.filter((n) => n > 0));

    notEmpty.forEach((col) => {
      for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
          col[i] *= 2;

          this.score += col[i];
          col[i + 1] = 0;
        }
      }
    });

    notEmpty = notEmpty.map((col) => col.filter((n) => n > 0));

    for (const col of notEmpty) {
      while (col.length < this.size) {
        col.push(0);
      }
    }

    notEmpty = this.columnsToRows(notEmpty);

    const untill = JSON.stringify(this.board);

    this.board = notEmpty;

    const afterr = JSON.stringify(this.board);

    this.lose(untill, afterr);
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let notEmpty = [];

    for (let col = 0; col < this.size; col++) {
      const colArray = [];

      for (let row = 0; row < this.size; row++) {
        colArray.push(this.board[row][col]);
      }

      notEmpty.push(colArray);
    }

    notEmpty = notEmpty.map((col) => col.filter((n) => n > 0));

    notEmpty.forEach((col) => {
      for (let i = col.length - 1; i > 0; i--) {
        if (col[i] === col[i - 1]) {
          col[i] *= 2;

          this.score += col[i];
          col[i - 1] = 0;
        }
      }
    });

    notEmpty = notEmpty.map((col) => col.filter((n) => n > 0));

    for (const col of notEmpty) {
      while (col.length < this.size) {
        col.unshift(0);
      }
    }

    notEmpty = this.columnsToRows(notEmpty);

    const untill = JSON.stringify(this.board);

    this.board = notEmpty;

    const afterr = JSON.stringify(this.board);

    this.win();

    this.lose(untill, afterr);
  }

  win() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';
      }
    }
  }

  lose(beforeMove, afterMove) {
    if (beforeMove !== afterMove) {
      this.randomAdd();
    }

    for (const row of this.board) {
      if (row.includes(0)) {
        return;
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.board[row][col];

        if (col + 1 < this.size && this.board[row][col + 1] === value) {
          return;
        }

        if (row + 1 < this.size && this.board[row + 1][col] === value) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  columnsToRows(columns) {
    const size = this.size;
    const rows = Array.from({ length: size }, () => Array(size).fill(0));

    for (let col = 0; col < size; col++) {
      for (let row = 0; row < size; row++) {
        rows[row][col] = columns[col][row];
      }
    }

    return rows;
  }

  // moveX() {
  //   if (this.status !== 'playing') {
  //     return;
  //   }

  //   const notEmpty = this.board.map((row) => row.filter((n) => n > 0));

  //   return notEmpty;
  // }

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
    // console.log(this.tokens);
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
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
    this.board = [];

    for (let i = 0; i < 4; i++) {
      this.board[i] = Array(this.size).fill(0);
    }

    this.score = 0;
    this.status = 'playing';

    this.randomAdd();
    this.randomAdd();
  }

  randomAdd() {
    const empty = this.board.reduce((acc, innerArray, rowIndex) => {
      innerArray.forEach((num, colIndex) => {
        if (num === 0) {
          acc.push([rowIndex, colIndex]);
        }
      });

      return acc;
    }, []);

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
