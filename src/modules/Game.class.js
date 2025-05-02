'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    // Initialize board
    this.board =
      initialState ||
      Array(this.size)
        .fill()
        .map(() => Array(this.size).fill(0));
  }

  // Get current game state
  getState() {
    return this.board;
  }

  // Get current score
  getScore() {
    return this.score;
  }

  // Get current game status
  getStatus() {
    return this.status;
  }

  // Start new game
  start() {
    this.status = 'playing';
    this.addNewNumber();
    this.addNewNumber();
  }

  // Restart game
  restart() {
    this.board = Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  // Add new number (2 or 4) to random empty cell
  addNewNumber() {
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

      // 10% chance for 4, 90% chance for 2
      this.board[randomCell.x][randomCell.y] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  // Check if game is over
  checkGameOver() {
    // Check for 2048
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Check for empty cells
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return;
        }
      }
    }

    // Check for possible merges
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.board[i][j];

        if (
          (i < this.size - 1 && this.board[i + 1][j] === current) ||
          (j < this.size - 1 && this.board[i][j + 1] === current)
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  // Move functions
  moveLeft() {
    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const row = this.board[i].filter((cell) => cell !== 0);
      const merged = [];

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
          merged.push(j);
          moved = true;
        }
      }

      const newRow = row.concat(Array(this.size - row.length).fill(0));

      if (JSON.stringify(this.board[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }

      this.board[i] = newRow;
    }

    if (moved) {
      this.addNewNumber();
      this.checkGameOver();
    }

    return moved;
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => row.reverse());

    return moved;
  }

  moveUp() {
    this.board = this.transpose(this.board);

    const moved = this.moveLeft();

    this.board = this.transpose(this.board);

    return moved;
  }

  moveDown() {
    this.board = this.transpose(this.board);

    const moved = this.moveRight();

    this.board = this.transpose(this.board);

    return moved;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }
}

export default Game;
