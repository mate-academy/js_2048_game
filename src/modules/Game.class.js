'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let changed = false;

    for (let i = 0; i < 4; i++) {
      const oldRow = [...this.board[i]];
      let row = this.board[i];

      row = row.filter((num) => num !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;

          if (row[j] === 2048) {
            this.status = 'win';
          }
          this.score += row[j];
          row[j + 1] = 0;
          j++;
        }
      }

      row = row.filter((num) => num !== 0);

      while (row.length < 4) {
        row.push(0);
      }
      this.board[i] = row;

      if (oldRow.join() !== row.join()) {
        changed = true;
      }
    }

    if (changed) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  moveRight() {
    let changed = false;

    for (let i = 0; i < 4; i++) {
      const oldRow = [...this.board[i]];
      let row = this.board[i];

      row = row.filter((num) => num !== 0);

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;

          if (row[j] === 2048) {
            this.status = 'win';
          }
          this.score += row[j];
          row[j - 1] = 0;
          j--;
        }
      }

      row = row.filter((num) => num !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }
      this.board[i] = row;

      if (oldRow.join() !== row.join()) {
        changed = true;
      }
    }

    if (changed) {
      this.addRandomTile();
    }
    this.checkGameOver();
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

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
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
  /**
   * Starts the game.
   */
  start() {
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return;
        }
      }
    }

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 3; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  transpose() {
    const newBoard = [];

    for (let i = 0; i < 4; i++) {
      newBoard[i] = [];

      for (let j = 0; j < 4; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }
    this.board = newBoard;
  }
}

module.exports = Game;
