'use strict';

/**
 * This class represents the game.
 * It includes full logic for 2048 gameplay.
 */

class Game {
  /**
   * Creates a new game instance.
   * @param {number[][]} initialState
   */
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    this.board = initialState || this.createEmptyBoard();
  }

  /**
   * Creates an empty 4x4 board.
   * @returns {number[][]}
   */
  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  /**
   * Returns current board state.
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns current score.
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * Returns current game status.
   * @returns {'idle' | 'playing' | 'win' | 'lose'}
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  /**
   * Adds a random tile (2 or 4) to an empty cell.
   */
  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [randRow, randCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[randRow][randCol] = Math.random() < 0.1 ? 4 : 2;
  }

  /**
   * Moves tiles left.
   * @returns {boolean}
   */
  moveLeft() {
    return this.move('left');
  }

  /**
   * Moves tiles right.
   * @returns {boolean}
   */
  moveRight() {
    return this.move('right');
  }

  /**
   * Moves tiles up.
   * @returns {boolean}
   */
  moveUp() {
    return this.move('up');
  }

  /**
   * Moves tiles down.
   * @returns {boolean}
   */
  moveDown() {
    return this.move('down');
  }

  /**
   * General move handler.
   * @param {'left' | 'right' | 'up' | 'down'} direction
   * @returns {boolean}
   */
  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const original = JSON.stringify(this.board);
    let board = this.board.map((row) => [...row]); // глибока копія

    const rotate = (matrix) =>
      matrix[0].map((_, i) => matrix.map((row) => row[i]));

    // Підготовка до злиття залежно від напрямку
    if (direction === 'up') {
      board = rotate(board);
    }

    if (direction === 'down') {
      board = rotate(board).map((row) => row.reverse());
    }

    if (direction === 'right') {
      board = board.map((row) => row.reverse());
    }

    // Злиття плиток
    board = board.map((row) => this.mergeRow(row));

    // Повернення до оригінального напрямку
    if (direction === 'up') {
      board = rotate(board);
    }

    if (direction === 'down') {
      board = board.map((row) => row.reverse());
      board = rotate(board);
    }

    if (direction === 'right') {
      board = board.map((row) => row.reverse());
    }

    const moved = JSON.stringify(board) !== original;

    if (moved) {
      this.board = board;
      this.addRandomTile();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    return moved;
  }

  /**
   * Merges a single row according to 2048 rules.
   * @param {number[]} row
   * @returns {number[]}
   */
  mergeRow(row) {
    const filtered = row.filter((val) => val !== 0);
    const merged = [];
    let i = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        const newVal = filtered[i] * 2;

        merged.push(newVal);
        this.score += newVal;

        if (newVal === 2048) {
          this.status = 'win';
        }
        i += 2;
      } else {
        merged.push(filtered[i]);
        i++;
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  /**
   * Checks if any moves are possible.
   * @returns {boolean}
   */
  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const val = this.board[row][col];

        if (val === 0) {
          return true;
        }

        if (row < this.size - 1 && val === this.board[row + 1][col]) {
          return true;
        }

        if (col < this.size - 1 && val === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
