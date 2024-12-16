'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
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

  start() {
    this.status = 'playing';
    this.addNewTile();
    this.addNewTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.addNewTile();
    this.addNewTile();
  }

  addNewTile() {
    const emptyCells = [];

    this.board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cell === 0) {
          emptyCells.push([rIndex, cIndex]);
        }
      });
    });

    if (emptyCells.length > 0) {
      const [rIndex, cIndex] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[rIndex][cIndex] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    let moved = false;

    this.board.forEach((row) => {
      const newRow = row.filter((cell) => cell !== 0);
      const mergedRow = [];
      let skip = false;

      for (let i = 0; i < newRow.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (i + 1 < newRow.length && newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          skip = true;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }
      row.splice(0, 4, ...mergedRow);
      moved = true;
    });

    if (moved) {
      this.addNewTile();
    }
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);
  }

  moveDown() {
    this.board = this.transpose(this.board);
    this.moveRight();
    this.board = this.transpose(this.board);
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }
}

// Export Game class
module.exports = Game;
