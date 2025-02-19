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
    this.state = Game.copyState(initialState);
    this.initialState = Game.copyState(initialState);
    this.score = 0;
    this.status = 'idle';
  }
  static copyState(state) {
    return state.map((row) => row.slice());
  }

  static moveRowLeft(row, game) {
    let filteredRow = row.filter((value) => value !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        game.score += filteredRow[i];

        if (filteredRow[i] === 2048) {
          game.status = 'win';
        }
      }
    }
    filteredRow = filteredRow.filter((value) => value !== 0);

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  moveLeft() {
    if (this.status === 'playing') {
      let changed = false;

      for (let r = 0; r < 4; r++) {
        const originalRow = [...this.state[r]];

        this.state[r] = Game.moveRowLeft(this.state[r], this);

        if (!changed && originalRow.toString() !== this.state[r].toString()) {
          changed = true;
        }
      }

      if (changed) {
        this.addRandomTile();

        if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }
  static moveRowRigth(row, game) {
    let filteredRow = row.filter((value) => value !== 0);

    for (let i = filteredRow.length - 1; i > 0; i--) {
      if (filteredRow[i] === filteredRow[i - 1]) {
        filteredRow[i] *= 2;
        filteredRow[i - 1] = 0;
        game.score += filteredRow[i];

        if (filteredRow[i] === 2048) {
          game.status = 'win';
        }
      }
    }

    filteredRow = filteredRow.filter((value) => value !== 0);

    while (filteredRow.length < 4) {
      filteredRow.unshift(0);
    }

    return filteredRow;
  }
  moveRight() {
    if (this.status === 'playing') {
      let changed = false;

      for (let r = 0; r < 4; r++) {
        const originalRow = [...this.state[r]];

        this.state[r] = Game.moveRowRigth(this.state[r], this);

        if (!changed && originalRow.toString() !== this.state[r].toString()) {
          changed = true;
        }
      }

      if (changed) {
        this.addRandomTile();

        if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const value = this.state[r][c];

        if (value === 0) {
          return true;
        }

        if (c < 3 && value === this.state[r][c + 1]) {
          return true;
        }

        if (r < 3 && value === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  static moveColumnUp(col, game) {
    let filteredColumn = col.filter((value) => value !== 0);

    for (let i = 0; i < filteredColumn.length - 1; i++) {
      if (filteredColumn[i] === filteredColumn[i + 1]) {
        filteredColumn[i] *= 2;
        filteredColumn[i + 1] = 0;
        game.score += filteredColumn[i];

        if (filteredColumn[i] === 2048) {
          game.status = 'win';
        }
      }
    }
    filteredColumn = filteredColumn.filter((value) => value !== 0);

    while (filteredColumn.length < 4) {
      filteredColumn.push(0);
    }

    return filteredColumn;
  }
  moveUp() {
    if (this.status === 'playing') {
      let changed = false;

      for (let c = 0; c < 4; c++) {
        const originalColumn = [
          this.state[0][c],
          this.state[1][c],
          this.state[2][c],
          this.state[3][c],
        ];
        const newColumn = Game.moveColumnUp(originalColumn, this);

        if (!changed && newColumn.toString() !== originalColumn.toString()) {
          changed = true;
        }

        for (let r = 0; r < 4; r++) {
          this.state[r][c] = newColumn[r];
        }
      }

      if (changed) {
        this.addRandomTile();

        if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }

  static moveColumnDown(col, game) {
    let filteredColumn = col.filter((value) => value !== 0);

    for (let i = filteredColumn.length - 1; i > 0; i--) {
      if (filteredColumn[i] === filteredColumn[i - 1]) {
        filteredColumn[i] *= 2;
        filteredColumn[i - 1] = 0;
        game.score += filteredColumn[i];

        if (filteredColumn[i] === 2048) {
          game.status = 'win';
        }
      }
    }
    filteredColumn = filteredColumn.filter((value) => value !== 0);

    while (filteredColumn.length < 4) {
      filteredColumn.unshift(0);
    }

    return filteredColumn;
  }
  moveDown() {
    if (this.status === 'playing') {
      let changed = false;

      for (let c = 0; c < 4; c++) {
        const originalColumn = [
          this.state[0][c],
          this.state[1][c],
          this.state[2][c],
          this.state[3][c],
        ];
        const newColumn = Game.moveColumnDown(originalColumn, this);

        if (!changed && newColumn.toString() !== originalColumn.toString()) {
          changed = true;
        }

        for (let r = 0; r < 4; r++) {
          this.state[r][c] = newColumn[r];
        }
      }

      if (changed) {
        this.addRandomTile();

        if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
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
    return Game.copyState(this.state);
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

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      const newValue = Math.random() < 0.9 ? 2 : 4;

      this.state[row][col] = newValue;
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.status = 'playing';

    // if (this.state.every((row) => row.every((cell) => cell === 0))) {
    this.addRandomTile(2);
    this.addRandomTile(2);
    // }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = Game.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;
