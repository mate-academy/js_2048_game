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
  constructor(initialState = []) {
    if (initialState.length > 0) {
      this.state = JSON.parse(JSON.stringify(initialState));
      this.initialState = JSON.parse(JSON.stringify(initialState));
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.initialState = null;
    }

    this.score = 0;
    this.status = 'idle';
  }

  slide(row) {
    const filtered = row.filter((num) => num);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
        this.score += filtered[i];
      }
    }

    const result = filtered.filter((num) => num);

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  moveLeft() {
    const oldState = JSON.stringify(this.state);

    for (let i = 0; i < 4; i++) {
      this.state[i] = this.slide(this.state[i]);
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addRandomTile();

      if (this.has2048()) {
        this.status = 'win';
      }

      if (!this.canMove()) {
        this.status = 'lose';
      }

      return true;
    }

    return false;
  }
  moveRight() {
    const oldState = JSON.stringify(this.state);

    for (let i = 0; i < 4; i++) {
      const reversed = this.state[i].reverse();
      const slid = this.slide(reversed);

      this.state[i] = slid.reverse();
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addRandomTile();

      if (this.has2048()) {
        this.status = 'win';
      }

      if (!this.canMove()) {
        this.status = 'lose';
      }

      return true;
    }

    return false;
  }
  moveUp() {
    const oldState = JSON.stringify(this.state);

    for (let col = 0; col < 4; col++) {
      const column = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];

      const slid = this.slide(column);

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = slid[row];
      }
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addRandomTile();

      if (this.has2048()) {
        this.status = 'win';
      }

      if (!this.canMove()) {
        this.status = 'lose';
      }

      return true;
    }

    return false;
  }
  moveDown() {
    const oldState = JSON.stringify(this.state);

    for (let col = 0; col < 4; col++) {
      const column = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];

      const slid = this.slide(column.reverse());
      const result = slid.reverse();

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = result[row];
      }
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addRandomTile();

      if (this.has2048()) {
        this.status = 'win';
      }

      if (!this.canMove()) {
        this.status = 'lose';
      }

      return true;
    }

    return false;
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    if (!this.initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';

    if (!this.initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomCell.row][randomCell.col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  has2048() {
    return this.state.flat().some((num) => num === 2048);
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        if (col < 3 && current === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && current === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
