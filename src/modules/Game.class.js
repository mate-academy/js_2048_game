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
    this.state = initialState;
    this.score = 0;
    this.status = 'idle';
    // eslint-disable-next-line no-console
    console.log(this.state);
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.state.length; row++) {
      // eslint-disable-next-line
      let newRow = this.state[row].filter((cell) => cell !== 0); // Remove all zeros

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2; // Merge cells
          this.score += newRow[col]; // Add the value to the score
          newRow[col + 1] = 0; // Set the next cell to zero
          moved = true;
        }
      }
      newRow = newRow.filter((cell) => cell !== 0); // Remove zeros again

      while (newRow.length < 4) {
        newRow.push(0); // Fill the rest with zeros
      }

      if (this.state[row].toString() !== newRow.toString()) {
        moved = true;
      }
      this.state[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
    }
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < this.state.length; row++) {
      // eslint-disable-next-line
      let newRow = this.state[row].filter((cell) => cell !== 0); // Remove all zeros

      for (let col = newRow.length - 1; col > 0; col--) {
        if (newRow[col] === newRow[col - 1]) {
          newRow[col] *= 2; // Merge cells
          this.score += newRow[col]; // Add the value to the score
          newRow[col - 1] = 0; // Set the previous cell to zero
          moved = true;
        }
      }
      newRow = newRow.filter((cell) => cell !== 0); // Remove zeros again

      while (newRow.length < 4) {
        newRow.unshift(0); // Fill the rest with zeros
      }

      if (this.state[row].toString() !== newRow.toString()) {
        moved = true;
      }
      this.state[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
    }
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < this.state[0].length; col++) {
      let newCol = [];

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][col] !== 0) {
          newCol.push(this.state[row][col]);
        }
      }

      for (let row = 0; row < newCol.length - 1; row++) {
        if (newCol[row] === newCol[row + 1]) {
          newCol[row] *= 2; // Merge cells
          this.score += newCol[row]; // Add the value to the score
          newCol[row + 1] = 0; // Set the next cell to zero
          moved = true;
        }
      }
      newCol = newCol.filter((cell) => cell !== 0); // Remove zeros again

      while (newCol.length < 4) {
        newCol.push(0); // Fill the rest with zeros
      }

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][col] !== newCol[row]) {
          moved = true;
        }
        this.state[row][col] = newCol[row];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
    }
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < this.state[0].length; col++) {
      let newCol = [];

      for (let row = this.state.length - 1; row >= 0; row--) {
        if (this.state[row][col] !== 0) {
          newCol.push(this.state[row][col]);
        }
      }

      for (let row = 0; row < newCol.length - 1; row++) {
        if (newCol[row] === newCol[row + 1]) {
          newCol[row] *= 2; // Merge cells
          this.score += newCol[row]; // Add the score
          newCol[row + 1] = 0; // Set the next cell to zero
          moved = true;
        }
      }
      newCol = newCol.filter((cell) => cell !== 0); // Remove zeros again

      while (newCol.length < 4) {
        newCol.push(0); // Fill the rest with zeros
      }

      for (let row = this.state.length - 1; row >= 0; row--) {
        if (this.state[row][col] !== newCol[this.state.length - 1 - row]) {
          moved = true;
        }
        this.state[row][col] = newCol[this.state.length - 1 - row];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
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
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let cell = 0; cell < this.state[row].length; cell++) {
        if (this.state[row][cell] === 0) {
          emptyCells.push({ row, cell });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, cell } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[row][cell] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkWin() {
    for (let row = 0; row < this.state.length; row++) {
      for (let cell = 0; cell < this.state[row].length; cell++) {
        if (this.state[row][cell] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    for (let row = 0; row < this.state.length; row++) {
      for (let cell = 0; cell < this.state[row].length; cell++) {
        if (this.state[row][cell] === 0) {
          return false;
        }

        if (row > 0 && this.state[row][cell] === this.state[row - 1][cell]) {
          return false;
        }

        if (cell > 0 && this.state[row][cell] === this.state[row][cell - 1]) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }
}

export default Game;
