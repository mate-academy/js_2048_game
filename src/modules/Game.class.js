'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  constructor(initialState) {
    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;

      return true;
    }

    return false;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    // Check for win
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return 'win';
        }
      }
    }

    // Check for empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          this.status = 'playing';

          return 'playing';
        }
      }
    }

    // Check for possible merges
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          this.status = 'playing';

          return 'playing';
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          this.status = 'playing';

          return 'playing';
        }
      }
    }

    this.status = 'lose';

    return 'lose';
  }

  processRow(row) {
    // Filter out zeros
    let filtered = row.filter((cell) => cell !== 0);

    // Merge adjacent equal values
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    // Filter out zeros again
    filtered = filtered.filter((cell) => cell !== 0);

    // Pad with zeros
    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    for (let row = 0; row < 4; row++) {
      this.board[row] = this.processRow(this.board[row]);
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.getStatus();
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    for (let row = 0; row < 4; row++) {
      const reversed = [...this.board[row]].reverse();
      const processed = this.processRow(reversed);

      this.board[row] = processed.reverse();
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.getStatus();
  }

  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const processed = this.processRow(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = processed[row];
      }
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.getStatus();
  }

  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const reversed = column.reverse();
      const processed = this.processRow(reversed);
      const result = processed.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = result[row];
      }
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.getStatus();
  }

  start() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }
}

export default Game;
