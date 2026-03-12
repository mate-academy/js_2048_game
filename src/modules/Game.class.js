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
    this.initialState = initialState.map((row) => [...row]);
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
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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

  moveLeft() {
    const copyMove = JSON.stringify(this.board);

    if (this.getStatus() !== 'playing') {
      return;
    }

    this.board.forEach((row, rowIndex) => {
      const filtered = row.filter((cell) => cell !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] = filtered[i] * 2;
          filtered.splice(i + 1, 1);
          this.score += filtered[i];
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.board[rowIndex] = filtered;
    });

    if (JSON.stringify(this.board) === copyMove) {
      return false;
    }

    this.addRandomTile();
    this.checkWin();
    this.checkLose();
  }

  moveRight() {
    const copyMove = JSON.stringify(this.board);

    if (this.getStatus() !== 'playing') {
      return;
    }

    this.board.forEach((row, rowIndex) => {
      const reversed = row.reverse();
      const filtered = reversed.filter((cell) => cell !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] = filtered[i] * 2;
          filtered.splice(i + 1, 1);
          this.score += filtered[i];
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.board[rowIndex] = filtered.reverse();
    });

    if (JSON.stringify(this.board) === copyMove) {
      return false;
    }

    this.addRandomTile();
    this.checkWin();
    this.checkLose();
  }

  moveUp() {
    const copyMove = JSON.stringify(this.board);

    if (this.getStatus() !== 'playing') {
      return;
    }

    for (let col = 0; col < 4; col++) {
      const column = this.board.map((row) => row[col]);

      const filtered = column.filter((cell) => cell !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] = filtered[i] * 2;
          filtered.splice(i + 1, 1);
          this.score += filtered[i];
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.board.forEach((row, rowIndex) => {
        row[col] = filtered[rowIndex];
      });
    }

    if (JSON.stringify(this.board) === copyMove) {
      return false;
    }

    this.addRandomTile();
    this.checkWin();
    this.checkLose();
  }

  moveDown() {
    const copyMove = JSON.stringify(this.board);

    if (this.getStatus() !== 'playing') {
      return;
    }

    for (let col = 0; col < 4; col++) {
      const column = this.board.map((row) => row[col]);

      column.reverse();

      const filtered = column.filter((cell) => cell !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] = filtered[i] * 2;
          filtered.splice(i + 1, 1);
          this.score += filtered[i];
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      filtered.reverse();

      this.board.forEach((row, rowIndex) => {
        row[col] = filtered[rowIndex];
      });
    }

    if (JSON.stringify(this.board) === copyMove) {
      return false;
    }

    this.addRandomTile();
    this.checkWin();
    this.checkLose();
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    this.lastTile = randomCell;
  }

  checkWin() {
    this.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 2048) {
          this.status = 'win';
        }
      });
    });
  }

  checkLose() {
    let canMove = false;

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          canMove = true;
        }

        if (cell === this.board[rowIndex][colIndex + 1]) {
          canMove = true;
        }

        if (
          this.board[rowIndex + 1] &&
          cell === this.board[rowIndex + 1][colIndex]
        ) {
          canMove = true;
        }
      });
    });

    if (canMove === false) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
