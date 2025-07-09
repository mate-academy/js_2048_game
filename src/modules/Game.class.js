'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.status = 'idle';

    this.score = 0;

    if (initialState) {
      this.board = initialState.map((row) => row.slice());
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const currentRow = this.board[i].filter((val) => val !== 0);
      const newRow = [];

      for (let j = 0; j < currentRow.length; j++) {
        if (currentRow[j] === currentRow[j + 1]) {
          const merged = currentRow[j] * 2;

          newRow.push(merged);

          this.score += merged;
          j++;
        } else {
          newRow.push(currentRow[j]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (newRow.join() !== this.board[i].join()) {
        moved = true;
      }

      this.board[i] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
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

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => row.slice());
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.status = 'idle';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const idx = Math.floor(Math.random() * emptyCells.length);
    const tile = Math.random() < 0.9 ? 2 : 4;
    const cell = emptyCells[idx];

    this.board[cell.row][cell.col] = tile;
  }

  checkGameStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (this.canMove()) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }
    this.board = newBoard;
  }

  reverseRows() {
    for (let i = 0; i < 4; i++) {
      this.board[i].reverse();
    }
  }
}

module.exports = Game;
