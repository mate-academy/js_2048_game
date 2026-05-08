'use strict';

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
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';
  }

  compress(row) {
    const newRow = row.filter((num) => num !== 0);

    return newRow;
  }

  merge(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        this.score += row[i];

        row[i] *= 2;
        row[i + 1] = 0;
      }
    }

    return row;
  }

  moveLeft() {
    const beforeState = this.board.join();

    for (let i = 0; i < 4; i++) {
      let row = this.board[i];

      row = this.compress(row);
      row = this.merge(row);
      row = this.compress(row);

      while (row.length < 4) {
        row.push(0);
      }

      this.board[i] = row;
    }

    return this.board.join() !== beforeState;
  }

  moveRight() {
    const beforeState = this.board.join();

    for (let i = 0; i < 4; i++) {
      let row = this.board[i];

      row.reverse();
      row = this.compress(row);
      row = this.merge(row);
      row = this.compress(row);
      row.reverse();

      while (row.length < 4) {
        row.unshift(0);
      }

      this.board[i] = row;
    }

    return this.board.join() !== beforeState;
  }

  moveUp() {
    const beforeState = this.board.join();

    for (let j = 0; j < 4; j++) {
      let column = [];

      for (let i = 0; i < 4; i++) {
        column.push(this.board[i][j]);
      }

      column = this.compress(column);
      column = this.merge(column);
      column = this.compress(column);

      while (column.length < 4) {
        column.push(0);
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = column[i];
      }
    }

    return this.board.join() !== beforeState;
  }

  moveDown() {
    const beforeState = this.board.join();

    for (let j = 0; j < 4; j++) {
      let column = [];

      for (let i = 0; i < 4; i++) {
        column.push(this.board[i][j]);
      }

      column.reverse();
      column = this.compress(column);
      column = this.merge(column);
      column = this.compress(column);
      column.reverse();

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = column[i];
      }
    }

    return this.board.join() !== beforeState;
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.board[i][j];

        // Перевіряємо сусіда справа
        if (j < 3 && current === this.board[i][j + 1]) {
          return false;
        }

        // Перевіряємо сусіда знизу
        if (i < 3 && current === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
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
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.row][randomCell.col] = value;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';
  }
}

module.exports = Game;
