'use strict';

class Game {
  constructor(initialState = null) {
    if (initialState) {
      this.board = initialState;
    } else {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(2));
    }

    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    for (let row = 0; row < this.board.length; row++) {
      const notEmptyCells = [];

      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] !== 0) {
          notEmptyCells.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < notEmptyCells.length; i++) {
        if (notEmptyCells[i] === notEmptyCells[i + 1]) {
          const result = notEmptyCells[i] * 2;

          notEmptyCells[i] = result;
          notEmptyCells[i + 1] = 0;
          i++;
        }
      }

      for (let k = notEmptyCells.length; k < 3; k++) {
        notEmptyCells[k] = 0;
      }

      for (let col = 0; col < this.board[row].length; col++) {
        this.board[row][col] = notEmptyCells[col];
      }
    }
  }
  moveRight() {
    for (let row = 0; row < this.board.length; row++) {
      this.board[row].reverse();
      this.moveLeft();
      this.board[row].reverse();
    }
  }
  moveUp() {}
  moveDown() {}

  getScore() {
    return this.score;
  }
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  start() {}

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomTile() {
    const emptyCells = [[]];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row][col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [randomRow, randomCol] = emptyCells[randomIndex];

      this.board[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
    }
  }
}

module.exports = Game;
