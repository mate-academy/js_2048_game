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
    console.log(initialState);

    if (initialState) {
      this.field = initialState;
    } else {
      this.field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const oldState = JSON.stringify(this.field);

    this.field.forEach((row) => {
      const processed = this.processRow(row);

      for (let i = 0; i < 4; i++) {
        row[i] = processed[i];
      }
    });

    this.updateStatusAfterMove(oldState);
  }
  moveRight() {
    const oldState = JSON.stringify(this.field);

    this.field.forEach((row) => {
      const reversedRow = [...row].reverse();

      const processed = this.processRow(reversedRow).reverse();

      for (let i = 0; i < 4; i++) {
        row[i] = processed[i];
      }
    });

    this.updateStatusAfterMove(oldState);
  }

  moveUp() {
    const oldState = JSON.stringify(this.field);

    const transposed = this.transpose(this.field);

    this.field = transposed.map((row) => this.processRow(row));

    this.field = this.transpose(this.field);

    this.updateStatusAfterMove(oldState);
  }

  moveDown() {
    const oldState = JSON.stringify(this.field);

    const transposed = this.transpose(this.field);

    transposed.forEach((row) => {
      const reversedRow = [...row].reverse();

      const processed = this.processRow(reversedRow).reverse();

      for (let i = 0; i < 4; i++) {
        row[i] = processed[i];
      }
    });

    this.field = this.transpose(transposed);

    this.updateStatusAfterMove(oldState);
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
    return this.field;
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
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  processRow(row) {
    const nonZero = row.filter((num) => num !== 0);

    for (let i = 0; i < nonZero.length - 1; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        nonZero[i] *= 2;
        this.score += nonZero[i];
        nonZero.splice(i + 1, 1);
      }
    }

    while (nonZero.length < 4) {
      nonZero.push(0);
    }

    return nonZero;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  hasChanged(oldField, newField) {
    return oldField !== newField;
  }

  addRandomTile() {
    const emptyCells = [];

    this.field.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.1 ? 4 : 2;

      this.field[randomCell.row][randomCell.col] = value;
    }
  }

  hasWin() {
    return this.field.some((row) => row.includes(2048));
  }

  hasEmptyCells() {
    return this.field.some((row) => row.includes(0));
  }

  canMerge() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.field[row][col];

        if (col < 3 && current === this.field[row][col + 1]) {
          return true;
        }

        if (row < 3 && current === this.field[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  hasLose() {
    return !this.hasEmptyCells() && !this.canMerge();
  }

  updateStatusAfterMove(oldState) {
    const newState = JSON.stringify(this.field);

    if (!this.hasChanged(oldState, newState)) {
      return;
    }

    if (this.hasWin()) {
      this.status = 'win';

      return;
    }

    this.addRandomTile();

    if (this.hasLose()) {
      this.status = 'lose';
    }
  }
}
module.exports = Game;
