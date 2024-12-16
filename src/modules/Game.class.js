'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState = null) {
    this.board =
      initialState ||
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
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
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  moveLeft() {
    // Implement sliding and merging logic here
  }

  moveRight() {
    // Rotate the board, call moveLeft, then rotate back
  }

  moveUp() {
    // Similar to moveRight
  }

  moveDown() {
    // Similar to moveRight
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }
}

module.exports = Game;
