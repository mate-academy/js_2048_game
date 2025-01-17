'use strict';

const rows = 4;
const columns = 4;

class Game {
  constructor(initialState = null) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        if (this.board[r][c] === 0) {
          emptyTiles.push({ r, c });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const { r, c } = emptyTiles[randomIndex];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < rows; row++) {
      const newRow = this.mergeRow(this.board[row]);

      if (this.board[row].toString() !== newRow.toString()) {
        moved = true;
        this.board[row] = newRow;
      }
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < rows; row++) {
      const reversedRow = [...this.board[row]].reverse();
      const newRow = this.mergeRow(reversedRow).reverse();

      if (this.board[row].toString() !== newRow.toString()) {
        moved = true;
        this.board[row] = newRow;
      }
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < columns; col++) {
      const column = this.board.map((row) => row[col]);
      const newColumn = this.mergeRow(column);

      for (let row = 0; row < rows; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          moved = true;
          this.board[row][col] = newColumn[row];
        }
      }
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < columns; col++) {
      const column = this.board.map((row) => row[col]).reverse();
      const newColumn = this.mergeRow(column).reverse();

      for (let row = 0; row < rows; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          moved = true;
          this.board[row][col] = newColumn[row];
        }
      }
    }

    return moved;
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
    this.status = 'playing';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  mergeRow(row) {
    const nonZeroTiles = row.filter((value) => value !== 0);
    const mergedRow = [];

    for (let i = 0; i < nonZeroTiles.length; i++) {
      if (nonZeroTiles[i] === nonZeroTiles[i + 1]) {
        mergedRow.push(nonZeroTiles[i] * 2);
        this.score += nonZeroTiles[i] * 2;
        i++;
      } else {
        mergedRow.push(nonZeroTiles[i]);
      }
    }

    while (mergedRow.length < columns) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  isGameOver() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const value = this.board[r][c];

        if (
          (c < columns - 1 && value === this.board[r][c + 1]) ||
          (r < rows - 1 && value === this.board[r + 1][c])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  checkGameOver() {
    if (this.isGameOver()) {
      this.status = 'lose';
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }
  }

  getFlattenedBoard() {
    return this.board.flat();
  }
}

module.exports = Game;
