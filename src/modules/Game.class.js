'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

export class Game {
  constructor(initialState) {
    this.size = 4;

    this.state = initialState || {
      board: this.generateEmptyBoard(),
      score: 0,
      status: 'menu',
    };
  }

  generateEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.state.score;
  }

  getStatus() {
    return this.state.status;
  }

  start() {
    this.state.board = this.generateEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.state.score = 0;
    this.state.status = 'playing';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      for (let colIndex = 0; colIndex < this.size; colIndex++) {
        if (this.state.board[rowIndex][colIndex] === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  moveLeft() {
    this.move((row) => row);
  }

  moveRight() {
    this.move((row) => row.slice().reverse(), true);
  }

  moveUp() {
    this.moveColumn(false);
  }

  moveDown() {
    this.moveColumn(true);
  }

  move(transformRow, reversed = false) {
    let moved = false;
    let newScore = this.state.score;
    const newBoard = this.state.board.map((originalRow) => {
      const row = transformRow(originalRow);

      let newRow = row.filter((v) => v !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newScore += newRow[i];
          newRow[i + 1] = 0;
          moved = true;
        }
      }

      newRow = newRow.filter((v) => v !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (reversed) {
        newRow = newRow.reverse();
      }

      if (newRow.some((val, idx) => val !== originalRow[idx])) {
        moved = true;
      }

      return newRow;
    });

    if (moved) {
      this.state.board = newBoard;
      this.state.score = newScore;
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveColumn(down = false) {
    const rotated = this.transpose(this.state.board);
    let moved = false;
    let newScore = this.state.score;

    const newRotated = rotated.map((col) => {
      let newCol = down ? col.slice().reverse() : col.slice();

      newCol = newCol.filter((v) => v !== 0);

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newScore += newCol[i];
          newCol[i + 1] = 0;
          moved = true;
        }
      }

      newCol = newCol.filter((v) => v !== 0);

      while (newCol.length < this.size) {
        newCol.push(0);
      }

      if (down) {
        newCol = newCol.reverse();
      }

      if (newCol.some((val, idx) => val !== col[idx])) {
        moved = true;
      }

      return newCol;
    });

    if (moved) {
      this.state.board = this.transpose(newRotated);
      this.state.score = newScore;
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  checkGameOver() {
    const board = this.state.board;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] === 2048) {
          this.state.status = 'win';

          return;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = board[row][col];

        if (
          (col < this.size - 1 && value === board[row][col + 1]) ||
          (row < this.size - 1 && value === board[row + 1][col])
        ) {
          return;
        }
      }
    }
    this.state.status = 'lose';
  }

  restart() {
    this.state = {
      board: this.generateEmptyBoard(),
      score: 0,
      status: 'playing',
    };
    this.addRandomTile();
    this.addRandomTile();
  }
}
