/* eslint-disable indent */
'use strict';
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

    this.ROW_SIZE = 4;
    this.isInitial = !!initialState;
    this.initialState = initialState;
    this.createEmptyField();
  }

  moveHorizontal(trajectory) {
    for (let i = 0; i < this.field.length; i++) {
      let row = this.field[i].filter((num) => num !== 0);

      for (let j = 1; j < row.length; j++) {
        if (row[j - 1] === row[j]) {
          row[j - 1] *= 2;

          if (row[j - 1] === 2048) {
            this.status = 'win';
          }

          row[j] = 0;
          this.score += row[j - 1];
          j++;
        }
      }

      row = row.filter((num) => num !== 0);

      while (row.length < this.ROW_SIZE) {
        row.push(0);
      }

      if (trajectory === 'right') {
        this.field[i] = row.reverse();
      } else {
        this.field[i] = row;
      }
    }
  }
  moveLeft() {
    const prev = JSON.stringify(this.field);

    this.moveHorizontal('left');

    const current = JSON.stringify(this.field);

    if (prev !== current) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      }

      if (this.status === 'idle') {
        this.status = 'playing';
      }
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    }
  }
  moveRight() {
    const prev = JSON.stringify(this.field);

    this.moveHorizontal('right');

    const current = JSON.stringify(this.field);

    if (prev !== current) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      }

      if (this.status === 'idle') {
        this.status = 'playing';
      }
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    }
  }
  moveUp() {
    const prev = JSON.stringify(this.field);

    this.field = this.transpose(this.field);
    this.moveHorizontal('left');
    this.field = this.transpose(this.field);

    const current = JSON.stringify(this.field);

    if (prev !== current) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      }

      if (this.status === 'idle') {
        this.status = 'playing';
      }
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    }
  }
  moveDown() {
    const prev = JSON.stringify(this.field);

    this.field = this.transpose(this.field);
    this.moveHorizontal('right');
    this.field = this.transpose(this.field);

    const current = JSON.stringify(this.field);

    if (prev !== current) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      }

      if (this.status === 'idle') {
        this.status = 'playing';
      }
    }

    if (this.isGameOver()) {
      this.status = 'lose';
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
    const fieldClone = JSON.parse(JSON.stringify(this.field));

    return fieldClone;
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

    if (!this.isInitial) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.createEmptyField();
  }

  addRandomTile() {
    const coordinates = this.getEmptyCellCoords();

    if (coordinates.length === 0) {
      return;
    }

    const cellIndex = Math.floor(Math.random() * coordinates.length);
    const value = Math.random() < 0.9 ? 2 : 4;
    const { r, c } = coordinates[cellIndex];

    this.field[r][c] = value;
  }

  getEmptyCellCoords() {
    const coordinates = [];

    for (let rowIndex = 0; rowIndex < this.field.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < this.field[rowIndex].length;
        colIndex++
      ) {
        if (this.field[rowIndex][colIndex] === 0) {
          coordinates.push({ r: rowIndex, c: colIndex });
        }
      }
    }

    return coordinates;
  }

  createEmptyField() {
    this.field = this.initialState
      ? JSON.parse(JSON.stringify(this.initialState))
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
    this.score = 0;
    this.status = 'idle';
  }

  isGameOver() {
    const empty = this.getEmptyCellCoords();

    if (empty.length > 0) {
      return false;
    }

    for (let r = 0; r < this.ROW_SIZE; r++) {
      for (let c = 0; c < this.field[r].length; c++) {
        if (
          c + 1 < this.ROW_SIZE &&
          this.field[r][c] === this.field[r][c + 1]
        ) {
          return false;
        }

        if (
          r + 1 < this.ROW_SIZE &&
          this.field[r][c] === this.field[r + 1][c]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  transpose(matrix) {
    const transposed = [[], [], [], []];

    for (let r = 0; r < this.ROW_SIZE; r++) {
      for (let c = 0; c < this.ROW_SIZE; c++) {
        transposed[c].push(matrix[r][c]);
      }
    }

    return transposed;
  }
}

module.exports = Game;
