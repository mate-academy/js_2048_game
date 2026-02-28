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
    this.score = 0;
    this.status = 'idle';

    this.emptyField = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : this.emptyField.map((row) => [...row]);

    this.field = initialState || this.initialState.map((row) => [...row]);
    this.prevField = this.field.map((row) => [...row]);
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const empty = this.getEmptyCells();

    if (!empty.length) {
      return null;
    }

    const randomNumber = Math.random() < 0.1 ? 4 : 2;
    const randomIndex = empty[Math.floor(Math.random() * empty.length)];

    if (!Array.isArray(randomIndex) || randomIndex.length < 2) {
      return null;
    }

    this.field[randomIndex[0]][randomIndex[1]] = randomNumber;

    return randomIndex;
  }

  fieldsEqual(a, b) {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[i].length; j++) {
        if (a[i][j] !== b[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  compressAndMergeRow(row) {
    const result = [];
    const rowWithoutEmpty = row.filter((i) => i !== 0);

    for (let i = 0; i < rowWithoutEmpty.length; i++) {
      if (rowWithoutEmpty[i] === rowWithoutEmpty[i + 1]) {
        result.push(rowWithoutEmpty[i] * 2);
        this.score += rowWithoutEmpty[i] * 2;
        i++;
      } else {
        result.push(rowWithoutEmpty[i]);
      }
    }

    for (let i = 0; i < this.size; i++) {
      if (!result[i]) {
        result[i] = 0;
      }
    }

    return result;
  }

  transpose(field) {
    const columns = [];

    for (let i = 0; i < field.length; i++) {
      const column = [];

      for (let j = 0; j < field.length; j++) {
        column.push(field[j][i]);
      }
      columns.push(column);
    }

    return columns;
  }

  isGameOver() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === 0) {
          return false;
        }

        if (
          j < this.field[i].length - 1 &&
          this.field[i][j] === this.field[i][j + 1]
        ) {
          return false;
        }

        if (
          i < this.field.length - 1 &&
          this.field[i][j] === this.field[i + 1][j]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  isGameWin() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  moveLeft() {
    if (this.status === 'playing') {
      const start = this.field.map((row) => [...row]);
      const newField = start.map((row) => this.compressAndMergeRow(row));

      if (!this.fieldsEqual(start, newField)) {
        this.prevField = start;
        this.field = newField;
        this.addRandomTile();
        this.isGameWin();

        if (this.isGameOver()) {
          this.status = 'lose';
        }
      }
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const start = this.field.map((row) => [...row]);
      const newField = start.map((row) => {
        return this.compressAndMergeRow([...row].reverse()).reverse();
      });

      if (!this.fieldsEqual(start, newField)) {
        this.prevField = start;
        this.field = newField;
        this.addRandomTile();
        this.isGameWin();

        if (this.isGameOver()) {
          this.status = 'lose';
        }
      }
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const start = this.field.map((row) => [...row]);
      const newField = this.transpose(
        this.transpose(start).map((row) => {
          return this.compressAndMergeRow(row);
        }),
      );

      if (!this.fieldsEqual(start, newField)) {
        this.prevField = start;
        this.field = newField;
        this.addRandomTile();
        this.isGameWin();

        if (this.isGameOver()) {
          this.status = 'lose';
        }
      }
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const start = this.field.map((row) => [...row]);
      const newField = this.transpose(
        this.transpose(start).map((row) => {
          return this.compressAndMergeRow([...row].reverse()).reverse();
        }),
      );

      if (!this.fieldsEqual(start, newField)) {
        this.prevField = start;
        this.field = newField;
        this.addRandomTile();
        this.isGameWin();

        if (this.isGameOver()) {
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
    return this.field.map((row) => [...row]);
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
    this.prevField = this.field.map((row) => [...row]);
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.prevField = this.field.map((row) => [...row]);
    this.field = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;
