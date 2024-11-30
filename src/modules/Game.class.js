'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

function deepCopyArray(array) {
  return array.map(function (item) {
    return Array.isArray(item) ? deepCopyArray(item) : item;
  });
}

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
    this.score = 0;
    this.status = 'idle';

    this.initialState = deepCopyArray(
      initialState || [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    );
    this.board = deepCopyArray(this.initialState);
  }

  addNewCell() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.move(
      (row) => row,
      (board, newRow, rowIndex) => {
        for (let col = 0; col < 4; col++) {
          board[rowIndex][col] = newRow[col];
        }
      },
    );
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.move(
      (row) => row.slice().reverse(),
      (board, newRow, rowIndex) => {
        for (let col = 0; col < 4; col++) {
          board[rowIndex][col] = newRow[3 - col];
        }
      },
    );
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.move(
      (row, index) => this.board.map((rowItem) => rowItem[index]),
      (board, newRow, colIndex) => {
        for (let row = 0; row < 4; row++) {
          board[row][colIndex] = newRow[row];
        }
      },
    );
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.move(
      (row, index) => this.board.map((rowItem) => rowItem[index]).reverse(),
      (board, newRow, colIndex) => {
        newRow.reverse();

        for (let row = 0; row < 4; row++) {
          board[row][colIndex] = newRow[row];
        }
      },
    );
  }

  move(extractRow, insertRow) {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = extractRow(this.board[i], i);
      const newRow = this.combine(row);

      if (newRow.join('') !== row.join('')) {
        moved = true;
      }
      insertRow(this.board, newRow, i);
    }

    if (moved) {
      this.addNewCell();
      this.checkGameStatus();
    }
  }

  combine(inputRow) {
    const row = inputRow.filter((cell) => cell !== 0);
    let scoreDelta = 0;
    const newRow = [];

    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        newRow.push(row[i] * 2);
        scoreDelta += row[i] * 2;
        row[i + 1] = 0;
        i++;
      } else {
        newRow.push(row[i]);
      }
    }

    this.score += scoreDelta;

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col !== 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row !== 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addNewCell();
    this.addNewCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = deepCopyArray(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
