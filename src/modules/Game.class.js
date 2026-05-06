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
    this.score = 0;
    this.status = 'idle';

    this.board =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let moved = false;
    // Implement the logic for moving the tiles to the left.
    // Update the `moved` variable to `true` if any tile is moved or merged.

    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].filter((value) => value !== 0); // Remove zeros

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2; // Merge tiles
          this.score += row[j]; // Update score
          row.splice(j + 1, 1); // Remove the merged tile
          moved = true;
        }
      }

      row = row.filter((value) => value !== 0);
      // Remove zeros again after merging

      while (row.length < this.size) {
        row.push(0); // Add zeros to the end of the row
      }

      if (this.board[i].toString() !== row.toString()) {
        moved = true; // Check if the row has changed
      }

      this.board[i] = row; // Update the board with the new row
    }

    if (moved) {
      this.addRandomTile(); // Add a new tile if any move was made
      this.updateStatus(); // Update the game status after the move
    }
  }

  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].filter((value) => value !== 0); // Remove zeros

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2; // Merge tiles
          this.score += row[j]; // Update score
          row.splice(j - 1, 1); // Remove the merged tile
          moved = true;
        }
      }

      row = row.filter((value) => value !== 0);
      // Remove zeros again after merging

      while (row.length < this.size) {
        row.unshift(0); // Add zeros to the beginning of the row
      }

      if (this.board[i].toString() !== row.toString()) {
        moved = true; // Check if the row has changed
      }

      this.board[i] = row; // Update the board with the new row
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus(); // Update the game status after the move
    }
  }

  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.size; j++) {
      let column = [];

      for (let i = 0; i < this.size; i++) {
        if (this.board[i][j] !== 0) {
          column.push(this.board[i][j]); // Remove zeros
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2; // Merge tiles
          this.score += column[i]; // Update score
          column.splice(i + 1, 1); // Remove the merged tile
          moved = true;
        }
      }
      column = column.filter((value) => value !== 0);
      // Remove zeros again after merging

      while (column.length < this.size) {
        column.push(0); // Add zeros to the end of the column
      }

      for (let i = 0; i < this.size; i++) {
        if (this.board[i][j] !== column[i]) {
          moved = true; // Check if the column has changed
        }
        this.board[i][j] = column[i]; // Update the board with the new column
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus(); // Update the game status after the move
    }
  }
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.size; j++) {
      let column = [];

      for (let i = this.size - 1; i >= 0; i--) {
        if (this.board[i][j] !== 0) {
          column.push(this.board[i][j]); // Remove zeros
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2; // Merge tiles
          this.score += column[i]; // Update score
          column.splice(i + 1, 1); // Remove the merged tile
          moved = true;
        }
      }

      column = column.filter((value) => value !== 0);
      // Remove zeros again after merging

      while (column.length < this.size) {
        column.unshift(0); // Add zeros to the beginning of the column
      }

      for (let i = this.size - 1; i >= 0; i--) {
        if (this.board[i][j] !== column[this.size - 1 - i]) {
          moved = true; // Check if the column has changed
        }
        this.board[i][j] = column[this.size - 1 - i];
        // Update the board with the new column
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus(); // Update the game status after the move
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0),);

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

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateStatus() {
    // win condition
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    // empty cell exists
    if (this.board.some((row) => row.includes(0))) {
      this.status = 'playing';

      return;
    }

    // Перевірка можливих злиттів
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.board[i][j];

        // перевіряємо сусіда справа
        if (j < this.size - 1 && current === this.board[i][j + 1]) {
          this.status = 'playing';

          return;
        }

        // перевіряємо сусіда знизу
        if (i < this.size - 1 && current === this.board[i + 1][j]) {
          this.status = 'playing';

          return;
        }
      }
    }
    // якщо дійшли сюди - програш
    this.status = 'lose';
  }
}

module.exports = Game;
