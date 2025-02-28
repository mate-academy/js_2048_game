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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
  moveLeft() {
    this.move((row) => this.mergeLeft(row));
  }
  moveRight() {
    this.move((row) => this.mergeRight(row));
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  move(transform) {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;
    const newBoard = this.board.map((row) => {
      const newRow = transform([...row]);

      if (newRow.toString() !== row.toString()) {
        changed = true;
      }

      return newRow;
    });

    if (changed) {
      this.board = newBoard; // Apply only if something changed
      this.addRandomTile();
      this.checkGameStatus(); // Check only after a valid move
    }
  }

  mergeLeft(row) {
    const rowFiltered = row.filter((n) => n); // Remove zeros

    const newRow = Array(4).fill(0);
    let index = 0;

    for (let i = 0; i < rowFiltered.length; i++) {
      if (i < rowFiltered.length - 1 && rowFiltered[i] === rowFiltered[i + 1]) {
        newRow[index] = rowFiltered[i] * 2;
        this.score += newRow[index];
        i++; // Skip the next index as it is merged
      } else {
        newRow[index] = rowFiltered[i];
      }
      index++;
    }

    return newRow;
  }

  mergeRight(row) {
    const rowFiltered = row.filter((n) => n);

    const newRow = Array(4).fill(0);
    let index = 3;

    for (let i = rowFiltered.length - 1; i >= 0; i--) {
      if (i > 0 && rowFiltered[i] === rowFiltered[i - 1]) {
        newRow[index] = rowFiltered[i] * 2;
        this.score += newRow[index];
        i--;
      } else {
        newRow[index] = rowFiltered[i];
      }
      index--;
    }

    return newRow;
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  addRandomTile() {
    const emptyCells = []; // an array of coordinates (pairs [row, column])
    // of all empty cells on the board

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell) {
          emptyCells.push([i, j]);
        }
      });
    });

    if (emptyCells.length) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      // generates a random index in the range of available empty cells
      const newValue = Math.random() < 0.9 ? 2 : 4;

      this.board[x][y] = newValue;
    }
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
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
}

module.exports = Game;
