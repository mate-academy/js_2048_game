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
    const emptyField = () => Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    const valid =
      Array.isArray(initialState) &&
      initialState.length === 4 &&
      initialState.every((row) => Array.isArray(row) && row.length === 4);

    this.initialState = valid
      ? initialState.map((r) => r.slice())
      : emptyField();

    this.state = {
      field: this.initialState.map((r) => r.slice()),
      score: 0,
      status: 'idle',
    };
  }

  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const moved = this.moveJoin(this.state.field);

    if (!moved) {
      return;
    }

    this.addCell();

    if (this.checkWin()) {
      this.state.status = 'won';

      return;
    }

    if (!this.hasMoves()) {
      this.state.status = 'lose';
    }
  }

  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    this.reverseRows(this.state.field);

    const moved = this.moveJoin(this.state.field);

    this.reverseRows(this.state.field);

    if (!moved) {
      return;
    }

    this.addCell();

    if (this.checkWin()) {
      this.state.status = 'won';

      return;
    }

    if (!this.hasMoves()) {
      this.state.status = 'lose';
    }
  }

  reverseRows(field) {
    field.map((row) => row.reverse());
  }

  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    this.state.field = this.transpose(this.state.field);

    const moved = this.moveJoin(this.state.field);

    this.state.field = this.transpose(this.state.field);

    if (!moved) {
      return;
    }

    this.addCell();

    if (this.checkWin()) {
      this.state.status = 'won';

      return;
    }

    if (!this.hasMoves()) {
      this.state.status = 'lose';
    }
  }
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    this.state.field = this.transpose(this.state.field);
    this.reverseRows(this.state.field);

    const moved = this.moveJoin(this.state.field);

    this.reverseRows(this.state.field);
    this.state.field = this.transpose(this.state.field);

    if (!moved) {
      return;
    }

    this.addCell();

    if (this.checkWin()) {
      this.state.status = 'won';

      return;
    }

    if (!this.hasMoves()) {
      this.state.status = 'lose';
    }
  }

  transpose(field) {
    const size = field.length;
    const result = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        result[i][j] = field[j][i];
      }
    }

    return result;
  }

  moveJoin(field) {
    let moved = false;

    field.forEach((row, index) => {
      const prevRow = row.join(',');

      let filtered = row.filter((col) => col !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          this.state.score += filtered[i];
        }
      }

      filtered = filtered.filter((col) => col !== 0);

      while (filtered.length < row.length) {
        filtered.push(0);
      }

      const currentRow = filtered.join(',');

      if (prevRow !== currentRow) {
        field[index] = filtered;
        moved = true;
      }
    });

    return moved;
  }

  checkWin() {
    const field = this.state.field;

    if (!Array.isArray(field) || field.length === 0) {
      return false;
    }

    return field.some((row) => Array.isArray(field) && row.includes(2048));
  }

  hasMoves() {
    const field = this.state.field;

    if (!field || !Array.isArray(field) || field.length === 0) {
      return false;
    }

    const size = field.length;

    if (field.some((row) => row.includes(0))) {
      return true;
    }

    for (let row = 0; row < size - 1; row++) {
      for (let col = 0; col < size; col++) {
        if (field[row][col] === field[row + 1][col]) {
          return true;
        }
      }
    }

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size - 1; col++) {
        if (field[row][col] === field[row][col + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.state.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state.field;
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
    return this.state.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.state.status = 'playing';
    this.addCell();
    this.addCell();
  }

  addCell() {
    const empty = [];
    const field = this.state.field;
    let r = 0;

    for (const row of field) {
      let c = 0;

      for (const val of row) {
        if (val === 0) {
          empty.push([r, c]);
        }
        c += 1;
      }
      r += 1;
    }

    if (empty.length > 0) {
      const [row, col] = empty[Math.floor(Math.random() * empty.length)];

      field[row][col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state.status = 'playing';
    this.state.score = 0;
    this.state.field = JSON.parse(JSON.stringify(this.initialState));
    this.addCell();
    this.addCell();
  }

  // Add your own methods here
}

export default Game;
