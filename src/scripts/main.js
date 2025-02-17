'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.board = initialState ? initialState.board : this.createEmptyBoard();
    this.score = initialState ? initialState.score : 0;
    this.status = 'playing';

    if (!initialState) {
      this.addNewTile();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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

  moveLeft() {
    return this.move((row) => row);
  }

  moveRight() {
    // First, reverse the row to handle the logic of moving tiles to the right
    // Then, we call the move method with the reversed row
    // Finally, we reverse the row back to return it
    // to its original order after the move operation
    return this.move((row) => row.reverse()).map((row) => row.reverse());
  }

  moveUp() {
    return this.transposeMove(this.moveLeft.bind(this));
  }

  moveDown() {
    return this.transposeMove(this.moveRight.bind(this));
  }

  move(transform) {
    let moved = false;
    const newBoard = this.board.map((row) => {
      const newRow = transform([...row]);
      const merged = this.merge(newRow);

      if (merged.some((val, index) => val !== newRow[index])) {
        moved = true;
      }

      return transform(merged);
    });

    if (moved) {
      this.board = newBoard;
      this.addNewTile();
      this.checkGameStatus();
    }

    return moved;
  }

  transposeMove(fn) {
    this.board = this.transpose(this.board);

    const moved = fn();

    this.board = this.transpose(this.board);

    return moved;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  merge(row) {
    const newRow = row.filter((num) => num);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }

    return [...newRow, ...Array(this.size - newRow.length).fill(0)];
  }

  addNewTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'game over';
    }
  }

  canMove() {
    return (
      this.board.some((row) => row.includes(0)) || this.hasMergeableCells()
    );
  }

  hasMergeableCells() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cell = this.board[r][c];

        if (
          cell &&
          ((this.board[r][c + 1] && cell === this.board[r][c + 1]) ||
            (this.board[r + 1] && cell === this.board[r + 1][c]))
        ) {
          return true;
        }
      }
    }

    return false;
  }

  start() {
    this.restart();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addNewTile();
  }
}

module.exports = Game;
