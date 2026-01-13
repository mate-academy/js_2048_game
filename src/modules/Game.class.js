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
    gameStatus = 'idle',
    score = 0,
  ) {
    // eslint-disable-next-line no-console
    console.log(initialState);
    this.gameStatus = gameStatus;
    this.currentState = structuredClone(initialState);
    this.score = score;
    this.initialState = structuredClone(initialState);
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < this.currentState.length; i++) {
      const row = this.currentState[i];

      let filteredRow = row.filter((num) => num !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] *= 2;
          this.score += filteredRow[j];

          if (filteredRow[j] === 2048) {
            this.gameStatus = 'win';
          }

          filteredRow[j + 1] = 0;
          moved = true;
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      if (!filteredRow.every((num, idx) => num === row[idx])) {
        moved = true;
      }

      this.currentState[i] = filteredRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();

      return true;
    }
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < this.currentState.length; i++) {
      const row = this.currentState[i];

      let filteredRow = row.filter((num) => num !== 0);

      for (let j = filteredRow.length - 1; j > 0; j--) {
        if (filteredRow[j] === filteredRow[j - 1]) {
          filteredRow[j] *= 2;
          this.score += filteredRow[j];

          if (filteredRow[j] === 2048) {
            this.gameStatus = 'win';
          }

          filteredRow[j - 1] = 0;
          moved = true;
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      while (filteredRow.length < 4) {
        filteredRow.unshift(0);
      }

      if (!filteredRow.every((num, idx) => num === row[idx])) {
        moved = true;
      }

      this.currentState[i] = filteredRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();

      return true;
    }
  }

  moveUp() {
    this.currentState = this.transpose(this.currentState);

    const moved = this.moveLeft();

    this.currentState = this.transpose(this.currentState);

    return moved;
  }

  moveDown() {
    this.currentState = this.transpose(this.currentState);

    const moved = this.moveRight();

    this.currentState = this.transpose(this.currentState);

    return moved;
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
    return this.currentState;
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
    return this.gameStatus;
  }

  start() {
    this.gameStatus = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.currentState = structuredClone(this.initialState);
    this.score = 0;
    this.gameStatus = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let i = 0; i < this.currentState.length; i++) {
      for (let j = 0; j < this.currentState[i].length; j++) {
        if (this.currentState[i][j] === 0) {
          emptyTiles.push([i, j]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [row, col] = emptyTiles[randomIndex];

    this.currentState[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose(matrix) {
    const transposed = [];

    for (let col = 0; col < matrix[0].length; col++) {
      const newRow = [];

      for (let row = 0; row < matrix.length; row++) {
        newRow.push(matrix[row][col]);
      }

      transposed.push(newRow);
    }

    return transposed;
  }

  checkGameOver() {
    for (let row = 0; row < this.currentState.length; row++) {
      for (let col = 0; col < this.currentState[row].length; col++) {
        if (this.currentState[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.currentState.length - 1; row++) {
      for (let col = 0; col < this.currentState[row].length - 1; col++) {
        if (this.currentState[row][col] === this.currentState[row][col + 1]) {
          return false;
        }

        if (this.currentState[row][col] === this.currentState[row + 1][col]) {
          return false;
        }
      }
    }

    this.gameStatus = 'lose';

    return true;
  }
}

module.exports = Game;
