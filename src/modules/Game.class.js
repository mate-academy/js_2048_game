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
    if (initialState) {
      this.board =
        typeof structuredClone === 'function'
          ? structuredClone(initialState)
          : initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.score = 0;
    this.status = 'idle';

    this.recentTiles = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    // eslint-disable-next-line no-console
  }

  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      const filtered = this.board[i].filter((elem) => elem !== 0);

      for (let c = 0; c < filtered.length - 1; c++) {
        if (filtered[c] === filtered[c + 1]) {
          filtered[c] *= 2;
          this.score += filtered[c];
          filtered[c + 1] = 0;
          c++;
        }
      }

      this.board[i] = filtered.filter((elem) => elem !== 0);

      while (this.board[i].length < this.board.length) {
        this.board[i].push(0);
      }
    }
  }

  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      const filtered = this.board[i].filter((elem) => elem !== 0);

      for (let c = filtered.length - 1; c > 0; c--) {
        if (filtered[c] === filtered[c - 1]) {
          filtered[c] *= 2;
          this.score += filtered[c];
          filtered[c - 1] = 0;
          c--;
        }
      }

      this.board[i] = filtered.filter((elem) => elem !== 0);

      while (this.board[i].length < this.board.length) {
        this.board[i].unshift(0);
      }
    }
  }

  moveUp() {
    const tempArr = Array.from({ length: this.board.length }, () => []);

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        tempArr[c].push(this.board[r][c]);
      }
    }

    for (let i = 0; i < tempArr.length; i++) {
      const filtered = tempArr[i].filter((elem) => elem !== 0);

      for (let c = 0; c < filtered.length - 1; c++) {
        if (filtered[c] === filtered[c + 1]) {
          filtered[c] *= 2;
          this.score += filtered[c];
          filtered[c + 1] = 0;
          c++;
        }
      }

      tempArr[i] = filtered.filter((elem) => elem !== 0);

      while (tempArr[i].length < this.board.length) {
        tempArr[i].push(0);
      }
    }

    for (let i = 0; i < tempArr.length; i++) {
      for (let c = 0; c < tempArr[i].length; c++) {
        this.board[c][i] = tempArr[i][c];
      }
    }
  }

  moveDown() {
    const tempArr = Array.from({ length: this.board.length }, () => []);

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        tempArr[c].push(this.board[r][c]);
      }
    }

    for (let i = 0; i < tempArr.length; i++) {
      const filtered = tempArr[i].filter((elem) => elem !== 0);

      for (let c = filtered.length - 1; c > 0; c--) {
        if (filtered[c] === filtered[c - 1]) {
          filtered[c] *= 2;
          this.score += filtered[c];
          filtered[c - 1] = 0;
          c--;
        }
      }

      tempArr[i] = filtered.filter((elem) => elem !== 0);

      while (tempArr[i].length < this.board.length) {
        tempArr[i].unshift(0);
      }
    }

    for (let i = 0; i < tempArr.length; i++) {
      for (let c = 0; c < tempArr[i].length; c++) {
        this.board[c][i] = tempArr[i][c];
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  getRecentTiles() {
    return this.recentTiles;
  }

  resetRecentTiles() {
    this.recentTiles = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
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

    const hasEmptyCells = this.board.flat().some((elem) => elem === 0);

    if (hasEmptyCells) {
      this.addRandomTile();
      this.addRandomTile();
    }
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
    this.start();
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const { row, col } = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = value;
    this.recentTiles[row][col] = value;
  }

  checkWin() {
    if (this.board.flat().some((elem) => +elem >= 2048)) {
      return true;
    } else {
      return false;
    }
  }

  hasAvailableMoves() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const value = this.board[i][j];

        if (value === 0) {
          return true;
        }

        if (j < this.board[i].length - 1 && value === this.board[i][j + 1]) {
          return true;
        }

        if (i < this.board.length - 1 && value === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.checkWin()) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }
}

module.exports = Game;
module.exports.default = Game;
