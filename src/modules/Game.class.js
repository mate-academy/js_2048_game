'use strict';

class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((cell) => cell !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (JSON.stringify(this.board[row]) !== JSON.stringify(newRow)) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    return moved;
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());

    const moved = this.moveLeft();

    this.board.forEach((row) => row.reverse());

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

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  checkGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    let canMove = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          canMove = true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          canMove = true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          canMove = true;
        }
      }
    }

    if (!canMove) {
      this.status = 'lose';
    }
  }
}

export default Game;
