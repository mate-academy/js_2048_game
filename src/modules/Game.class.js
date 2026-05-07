'use strict';

const defaultBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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
  constructor(initialState = defaultBoard) {
    this.initialState = initialState;
    this.score = 0;
    this.statusLog = 'idle';
    this.board = initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.statusLog !== 'playing') {
      return;
    }

    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];
      const filtered = row.filter((elem) => elem !== 0);

      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] *= 2;
          filtered.splice(j + 1, 1);

          this.score += filtered[j];
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.board[i] = filtered;
    }

    this.afterMove();
  }
  moveRight() {
    if (this.statusLog !== 'playing') {
      return;
    }

    for (let i = 0; i < this.board.length; i++) {
      const row = [...this.board[i]].reverse();
      const filtered = row.filter((elem) => elem !== 0);

      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] *= 2;
          filtered.splice(j + 1, 1);

          this.score += filtered[j];
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.board[i] = filtered.reverse();
    }

    this.afterMove();
  }
  moveUp() {
    if (this.statusLog !== 'playing') {
      return;
    }

    for (let i = 0; i < this.board.length; i++) {
      const columnData = this.board.map((row) => row[i]);
      const filtered = columnData.filter((elem) => elem !== 0);

      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] *= 2;
          filtered.splice(j + 1, 1);

          this.score += filtered[j];
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      for (let j = 0; j < columnData.length; j++) {
        this.board[j][i] = filtered[j];
      }
    }

    this.afterMove();
  }
  moveDown() {
    if (this.statusLog !== 'playing') {
      return;
    }

    for (let i = 0; i < this.board.length; i++) {
      const columnData = this.board.map((row) => row[i]).reverse();

      const filtered = columnData.filter((elem) => elem !== 0);

      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] *= 2;
          filtered.splice(j + 1, 1);

          this.score += filtered[j];
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      filtered.reverse();

      for (let j = 0; j < columnData.length; j++) {
        this.board[j][i] = filtered[j];
      }
    }

    this.afterMove();
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
    return this.statusLog;
  }

  /**
   * Starts the game.
   */
  start() {
    this.statusLog = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({
            row: i,
            col: j,
          });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.row][randomCell.col] = value;
  }

  afterMove() {
    this.addRandomTile();

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 2048) {
          this.statusLog = 'win';
        }
      }
    }

    if (!this.hasAvailableMoves()) {
      this.statusLog = 'lose';
    }
  }

  hasAvailableMoves() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j + 1 < this.board[i].length) {
          if (this.board[i][j] === this.board[i][j + 1]) {
            return true;
          }
        }

        if (i + 1 < this.board.length) {
          if (this.board[i][j] === this.board[i + 1][j]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.statusLog = 'idle';
    this.score = 0;
    this.board = this.initialState.map((row) => [...row]);
  }
}

module.exports = Game;
