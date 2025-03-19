/* eslint-disable no-shadow */
'use strict';

class Game {
  /**
   * Creates a new game instance.
   *
   * * @param {HTMLElement} gameField
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
  constructor(
    cells = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.cells = cells;
    this.restart();
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i].filter((val) => val !== 0);
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1]) {
          newRow.push(row[j] * 2);
          this.score += row[j] * 2;
          j++;
          moved = true;
        } else {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (this.board[i].toString() !== newRow.toString()) {
        this.board[i] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameOver();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i].filter((val) => val !== 0).reverse();
      const newRow = [];
      let j = 0;

      while (j < row.length) {
        if (row[j] === row[j + 1]) {
          newRow.push(row[j] * 2);
          this.score += row[j] * 2;
          j += 2;
          moved = true;
        } else {
          newRow.push(row[j]);
          j++;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newRow.reverse();

      if (this.board[i].toString() !== newRow.toString()) {
        this.board[i] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameOver();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      const newColumn = [];
      let i = 0;

      while (i < column.length) {
        if (column[i] === column[i + 1]) {
          newColumn.push(column[i] * 2);
          this.score += column[i] * 2;
          i += 2;
        } else {
          newColumn.push(column[i]);
          i++;
        }
      }

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          moved = true;
        }
        this.board[row][col] = newColumn[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameOver();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      const newColumn = [];
      let i = column.length - 1;

      while (i >= 0) {
        if (column[i] === column[i - 1]) {
          newColumn.unshift(column[i] * 2);
          this.score += column[i] * 2;
          i -= 2;
          moved = true;
        } else {
          newColumn.unshift(column[i]);
          i--;
        }
      }

      while (newColumn.length < 4) {
        newColumn.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          moved = true;
        }
        this.board[row][col] = newColumn[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameOver();
  }

  checkGameOver() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  displayGameStatus(stat) {
    const winMessage = document.querySelector('.message-win');
    const loseMessage = document.querySelector('.message-lose');

    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');

    if (stat === 'win') {
      winMessage.classList.remove('hidden');
    } else if (stat === 'lose') {
      loseMessage.classList.remove('hidden');
    } else if (stat === 'playing') {
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
    }
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
    return this.board.map((row) => [...row]);
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
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.cells.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, colIndex } = emptyCells[randomIndex];

      this.board[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;

      const cell = document.querySelector(
        `[data-position="${rowIndex}-${colIndex}"]`,
      );

      requestAnimationFrame(() => {
        cell.classList.add('field-cell--new');

        setTimeout(() => {
          cell.classList.remove('field-cell--new');
        }, 300);
      });
    }
  }
}

module.exports = Game;
