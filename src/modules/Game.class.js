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
    // eslint-disable-next-line no-console
    this.size = 4;
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    // console.log(initialState);
  }

  moveLeft() {
    const newBoard = this.board.map((row) => {
      let filtered = row.filter((num) => num !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          this.score += filtered[i];
        }
      }
      filtered = filtered.filter((num) => num !== 0);

      while (filtered.length < this.size) {
        filtered.push(0);
      }

      return filtered;
    });

    this.board = newBoard;
  }

  moveRight() {
    const newBoard = this.board.map((row) => {
      const reversed = [...row].reverse();
      let filtered = reversed.filter((num) => num !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          this.score += filtered[i];
        }
      }
      filtered = filtered.filter((num) => num !== 0);

      while (filtered.length < this.size) {
        filtered.push(0);
      }

      return filtered.reverse();
    });

    this.board = newBoard;
  }

  moveUp() {
    const newBoard = [];

    for (let col = 0; col < this.size; col++) {
      const column = this.board.map((row) => row[col]);
      let filtered = column.filter((num) => num !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
        }
      }
      filtered = filtered.filter((num) => num !== 0);

      while (filtered.length < this.size) {
        filtered.push(0);
      }

      filtered.forEach((num, row) => {
        if (!newBoard[row]) {
          newBoard[row] = [];
          newBoard[row][col] = num;
        }
      });
    }
    this.board = newBoard;
  }

  moveDown() {
    const newBoard = [];

    for (let col = 0; col < this.size; col++) {
      const column = this.board.map((row) => row[col]).reverse();
      let filtered = column.filter((num) => num !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
        }
      }
      filtered = filtered.filter((num) => num !== 0);

      while (filtered.length < this.size) {
        filtered.push(0);
      }
      filtered = filtered.reverse();

      filtered.forEach((num, row) => {
        if (!newBoard[row]) {
          newBoard[row] = [];
          newBoard[row][col] = num;
        }
      });
    }
    this.board = newBoard;
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
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.board[row][col];

        if (current === 0) {
          return true;
        }

        if (col < this.size - 1 && current === this.board[row][col + 1]) {
          return true;
        }

        if (row < this.size - 1 && current === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
