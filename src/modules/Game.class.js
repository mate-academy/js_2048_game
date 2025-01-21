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
  // constructor(
  //   initialState = [
  //     [2, 0, 0, 0],
  //     [0, 4, 0, 0],
  //     [0, 0, 8, 0],
  //     [0, 0, 0, 16],
  //   ],
  // ) {
  //   this.board =
  //     initialState ||
  //     Array(4)
  //       .fill(null)
  //       .map(() => Array(4).fill(0));
  //   this.score = 0;
  //   this.status = 'idle'; // Гра не розпочалась
  //   this.move = false;
  //   this.initialState = this.board;
  // }

  constructor(initialState) {
    this.initialState = initialState;

    this.board =
      initialState ||
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle'; // Гра не розпочалась
    this.move = false;
  }

  moveLeft() {
    let moved = false;

    for (const row of this.board) {
      const originalRow = [...row]; // Копія поточного рядка
      const filteredRow = row.filter((val) => val !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow[i + 1] = 0;
        }
      }

      const newRow = filteredRow.filter((val) => val !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (originalRow.toString() !== newRow.toString()) {
        moved = true;
      }

      row.splice(0, 4, ...newRow);
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver(); // Перевірка після руху
    }
  }

  moveRight() {
    let moved = false;

    for (const row of this.board) {
      const originalRow = [...row]; // Копія поточного рядка
      const filteredRow = row.filter((val) => val !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow[i - 1] = 0;
        }
      }

      const newRow = filteredRow.filter((val) => val !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      if (originalRow.toString() !== newRow.toString()) {
        moved = true;
      }

      row.splice(0, 4, ...newRow);
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver(); // Перевірка після руху
    }
  }

  moveUp() {
    this.transpose(); // Транспонуємо дошку
    this.moveLeft();
    this.transpose(); // Повертаємо дошку в початковий стан
  }

  moveDown() {
    this.transpose(); // Транспонуємо дошку
    this.moveRight();
    this.transpose(); // Повертаємо дошку в початковий стан
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
    if (!this.initialState) {
      this.board = Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
      this.addRandomTile();
      this.addRandomTile();
    } else {
      this.board = this.initialState.map((row) => [...row]);
    }
    this.score = 0;
    this.status = 'playing';
    this.move = false;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  /**
   * Adds a new tile to the board.
   */

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const randomCell = Math.random() < 0.9 ? 2 : 4;

      this.board[row][col] = randomCell;
    }
  }

  // Transpose the board

  transpose() {
    this.board = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );
  }

  // Check if the player has won

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  // Check if the game is over

  checkGameOver() {
    if (this.checkWin()) {
      this.status = 'win';

      return; // Виграш! Не потрібно перевіряти програш
    }

    // Перевірка, чи є вільні клітинки або можливість злиття
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return; // Є вільні клітинки
        }

        // Перевірка на можливість злиття плиток горизонтально та вертикально
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return; // Є плитки, які можна злитись горизонтально
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return; // Є плитки, які можна злитись вертикально
        }
      }
    }

    this.status = 'lose'; // Програш!
  }
}

module.exports = Game;
