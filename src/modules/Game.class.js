'use strict';
/* eslint-disable */

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  constructor(initialState = null) {
    this.size = 4; // Розмір ігрового поля

    this.board =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    this.initializeBoard();
  }

  initializeBoard() {
    if (this.status === 'idle' || this.status === 'lose') {
      this.addRandomTile();
      this.addRandomTile();
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
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.initializeBoard();
  }

  restart() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0),
    );

    this.score = 0;
    this.status = 'idle';
    this.initializeBoard();
  }

  moveUp() {
    this.makeMove(this.compressUp.bind(this));
  }

  moveDown() {
    this.makeMove(this.compressDown.bind(this));
  }

  moveRight() {
    this.makeMove(this.compressRight.bind(this));
  }

  moveLeft() {
    this.makeMove(this.compressLeft.bind(this));
  }

  makeMove(compressFunction) {
    const previousState = JSON.stringify(this.board);

    compressFunction();

    if (JSON.stringify(this.board) !== previousState) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (this.checkLose()) {
        this.status = 'lose';
      }
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  compressLeft() {
    for (let row = 0; row < this.size; row++) {
      this.board[row] = this.compressRow(this.board[row]);
    }
  }

  compressRight() {
    for (let row = 0; row < this.size; row++) {
      this.board[row] = this.compressRow(
        [...this.board[row]].reverse(),
      ).reverse();
    }
  }

  compressUp() {
    for (let col = 0; col < this.size; col++) {
      const column = this.board.map((row) => row[col]);
      const compressed = this.compressRow(column);

      compressed.forEach((value, rowIndex) => {
        this.board[rowIndex][col] = value;
      });
    }
  }

  compressDown() {
    for (let col = 0; col < this.size; col++) {
      const column = this.board.map((row) => row[col]).reverse();
      const compressed = this.compressRow(column).reverse();

      compressed.forEach((value, rowIndex) => {
        this.board[rowIndex][col] = value;
      });
    }
  }

  compressRow(row) {
    const newRow = row.filter((val) => val !== 0); // Залишаємо лише ненульові значення

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0; // Залишаємо нуль замість об'єднаної плитки
      }
    }

    return [
      ...newRow.filter((val) => val !== 0), // Видаляємо всі нулі
      ...Array(this.size - newRow.filter((val) => val !== 0).length).fill(0), // Додаємо порожні
    ];
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.board[row][col];

        if (
          (row > 0 && current === this.board[row - 1][col]) ||
          (row < this.size - 1 && current === this.board[row + 1][col]) ||
          (col > 0 && current === this.board[row][col - 1]) ||
          (col < this.size - 1 && current === this.board[row][col + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;

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
