'use strict';

class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'running';
    this.spawnTile();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  spawnTile() {
    const emptyCells = [];

    this.board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cell === 0) {
          emptyCells.push([rIndex, cIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [rowIndex, colIndex] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (const row of this.board) {
      const originalRow = [...row];

      this.merge(row);

      if (this.hasChanged(originalRow, row)) {
        moved = true;
      }
    }

    if (moved) {
      this.spawnTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  transpose() {
    this.board = this.board[0].map((_, colIndex) => {
      return this.board.map((row) => row[colIndex]);
    });
  }

  merge(row) {
    for (let i = 0; i < 4; i++) {
      if (row[i] === 0) {
        continue;
      }

      let next = i + 1;

      while (next < 4 && row[next] === 0) {
        next++;
      }

      if (next < 4 && row[i] === row[next]) {
        row[i] *= 2;
        this.score += row[i];
        row[next] = 0;
      }
    }

    const newRow = row.filter((cell) => cell !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    for (let i = 0; i < 4; i++) {
      row[i] = newRow[i];
    }
  }

  hasChanged(original, current) {
    return JSON.stringify(original) !== JSON.stringify(current);
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'won';
    } else if (!this.board.flat().includes(0) && this.noValidMoves()) {
      this.status = 'lost';
    }
  }

  noValidMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return false;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'running';
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.start();
  }
}

export default Game;
