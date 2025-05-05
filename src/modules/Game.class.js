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
    this.size = 4;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const originalRow = [...this.board[row]];
      const newRow = [];

      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] !== 0) {
          newRow.push(this.board[row][col]);
        }
      }

      // Злиття плиток
      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      // Заповнення порожніх клітинок нулями
      while (mergedRow.length < this.size) {
        mergedRow.push(0);
      }

      // Оновлюємо дошку тільки якщо змінилася
      if (JSON.stringify(originalRow) !== JSON.stringify(mergedRow)) {
        this.board[row] = mergedRow;
        moved = true;
      }
    }

    // Додаємо випадкову плитку лише якщо дошка змінилася
    if (moved) {
      this.addRandomTile();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const originalRow = [...this.board[row]];
      const reversedRow = [...originalRow].reverse();
      const filtered = reversedRow.filter((val) => val !== 0);
      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      const newRow = merged.reverse();

      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        this.board[row] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < this.size; col++) {
      const originalColumn = [];

      for (let row = 0; row < this.size; row++) {
        originalColumn.push(this.board[row][col]);
      }

      const filtered = originalColumn.filter((val) => val !== 0);
      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      const movedColumn = merged;

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== movedColumn[row]) {
          moved = true;
        }
        this.board[row][col] = movedColumn[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < this.size; col++) {
      const originalColumn = [];

      for (let row = this.size - 1; row >= 0; row--) {
        originalColumn.push(this.board[row][col]);
      }

      const filtered = originalColumn.filter((val) => val !== 0);

      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++; // пропускаємо наступний
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      for (let row = this.size - 1; row >= 0; row--) {
        const newValue = merged[this.size - 1 - row];

        if (this.board[row][col] !== newValue) {
          moved = true;
          this.board[row][col] = newValue;
        }
      }
    }

    if (moved) {
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
    if (this.isGameWon()) {
      this.status = 'win';
    } else if (this.isGameLost()) {
      this.status = 'lose';
    } else if (this.isGameInProgress()) {
      this.status = 'playing';
    } else {
      this.status = 'idle';
    }

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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  /**
   * Adds a random tile to the board.
   *
   * @returns {number[][]}
   */

  addRandomTile() {
    const emptyTiles = this.getEmptyTiles();

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [row, col] = emptyTiles[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    this.score += this.board[row][col];
    this.status = 'playing';
  }

  /**
   * Returns the empty tiles on the board.
   *
   * @returns {number[][]}
   */
  getEmptyTiles() {
    const emptyTiles = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyTiles.push([row, col]);
        }
      }
    }

    return emptyTiles;
  }
  /**
   * Checks if the game is over.
   *
   * @returns {boolean}
   */
  isGameOver() {
    // Check if there are any empty tiles
    if (this.getEmptyTiles().length > 0) {
      return false;
    }

    // Check if there are any possible moves
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (
          (col < this.size - 1 &&
            this.board[row][col] === this.board[row][col + 1]) ||
          (row < this.size - 1 &&
            this.board[row][col] === this.board[row + 1][col])
        ) {
          return false;
        }
      }
    }

    return true;
  }
  /**
   * Checks if the game is won.
   *
   * @returns {boolean}
   */
  isGameWon() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Checks if the game is lost.
   *
   * @returns {boolean}
   */
  isGameLost() {
    return this.isGameOver() && !this.isGameWon();
  }
  /**
   * Checks if the game is in progress.
   *
   * @returns {boolean}
   */
  isGameInProgress() {
    return this.status === 'playing';
  }
  /**
   * Checks if the game is idle.
   *
   * @returns {boolean}
   */
}

module.exports = Game;
