'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  initState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;

  status = 'idle';

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
      this.state = JSON.parse(JSON.stringify(initialState));
      this.initState = JSON.parse(JSON.stringify(initialState));
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.state);

    this.state.forEach((row) => {
      let compressedRow = row.filter((num) => num !== 0);

      while (compressedRow.length < 4) {
        compressedRow.push(0);
      }

      for (let i = 0; i < compressedRow.length - 1; i++) {
        if (
          compressedRow[i] === compressedRow[i + 1] &&
          compressedRow[i] !== 0
        ) {
          compressedRow[i] *= 2;
          this.score += compressedRow[i];
          compressedRow[i + 1] = 0;
        }
      }

      compressedRow = compressedRow.filter((num) => num !== 0);

      while (compressedRow.length < 4) {
        compressedRow.push(0);
      }

      for (let i = 0; i < row.length; i++) {
        row[i] = compressedRow[i];
      }
    });

    if (JSON.stringify(this.state) !== prevState) {
      this.spawnNewNum();
    }

    this.checkForWin();
    this.checkForLose();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.state);

    this.state.forEach((row) => {
      let compressedRow = row.filter((num) => num !== 0);

      while (compressedRow.length < 4) {
        compressedRow.unshift(0);
      }

      for (let i = compressedRow.length - 1; i > 0; i--) {
        if (
          compressedRow[i] === compressedRow[i - 1] &&
          compressedRow[i] !== 0
        ) {
          compressedRow[i] *= 2;
          this.score += compressedRow[i];
          compressedRow[i - 1] = 0;
        }
      }

      compressedRow = compressedRow.filter((num) => num !== 0);

      while (compressedRow.length < 4) {
        compressedRow.unshift(0);
      }

      for (let i = 0; i < row.length; i++) {
        row[i] = compressedRow[i];
      }
    });

    if (JSON.stringify(this.state) !== prevState) {
      this.spawnNewNum();
    }

    this.checkForWin();
    this.checkForLose();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.state);

    const columns = this.state[0].map(
      (_, colIndex) => this.state.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );

    columns.forEach((col) => {
      let compressedCol = col.filter((num) => num !== 0);

      while (compressedCol.length < 4) {
        compressedCol.push(0);
      }

      for (let i = 0; i < compressedCol.length - 1; i++) {
        if (
          compressedCol[i] === compressedCol[i + 1] &&
          compressedCol[i] !== 0
        ) {
          compressedCol[i] *= 2;
          this.score += compressedCol[i];
          compressedCol[i + 1] = 0;
        }
      }

      compressedCol = compressedCol.filter((num) => num !== 0);

      while (compressedCol.length < 4) {
        compressedCol.push(0);
      }

      for (let i = 0; i < col.length; i++) {
        col[i] = compressedCol[i];
      }
    });

    this.state = columns[0].map(
      (_, colIndex) => columns.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );

    if (JSON.stringify(this.state) !== prevState) {
      this.spawnNewNum();
    }

    this.checkForWin();
    this.checkForLose();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.state);

    const columns = this.state[0].map(
      (_, colIndex) => this.state.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );

    columns.forEach((col) => {
      let compressedCol = col.filter((num) => num !== 0);

      while (compressedCol.length < 4) {
        compressedCol.unshift(0);
      }

      for (let i = compressedCol.length - 1; i > 0; i--) {
        if (
          compressedCol[i] === compressedCol[i - 1] &&
          compressedCol[i] !== 0
        ) {
          compressedCol[i] *= 2;
          this.score += compressedCol[i];
          compressedCol[i - 1] = 0;
        }
      }

      compressedCol = compressedCol.filter((num) => num !== 0);

      while (compressedCol.length < 4) {
        compressedCol.unshift(0);
      }

      for (let i = 0; i < col.length; i++) {
        col[i] = compressedCol[i];
      }
    });

    this.state = columns[0].map(
      (_, colIndex) => columns.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );

    if (JSON.stringify(this.state) !== prevState) {
      this.spawnNewNum();
    }

    this.checkForWin();
    this.checkForLose();
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
    return this.state;
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
    this.spawnNewNum();
    this.spawnNewNum();
    this.checkForLose();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.clearTable();
    this.score = 0;
    this.status = 'idle';
  }

  spawnNewNum() {
    if (!this.checkEmptyCells()) {
      return;
    }

    const [a, b] = this.getRandomEmptyCell();

    if (this.state[a][b] !== 0) {
      return this.spawnNewNum();
    }

    this.state[a][b] = Math.floor(Math.random() * 11) === 10 ? 4 : 2;
  }

  getRandomEmptyCell() {
    return [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
  }

  checkEmptyCells() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  clearTable() {
    this.state = JSON.parse(JSON.stringify(this.initState));
  }

  checkForWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';
          this.handleWin();

          return;
        }
      }
    }
  }

  checkForLose() {
    if (!this.checkEmptyCells() && !this.checkMovesAvailable()) {
      this.status = 'lose';
      this.handleLoss();
    }
  }

  checkMovesAvailable() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  handleLoss() {
    // Trigger an event or call a function to update the UI
    const e = new Event('gameLost');

    document.dispatchEvent(e);
  }
  handleWin() {
    // Trigger an event or call a function to update the UI
    const e = new Event('gameWin');

    document.dispatchEvent(e);
  }
}

module.exports = Game;
