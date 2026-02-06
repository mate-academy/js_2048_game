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

    if (initialState !== undefined) {
      this.state = initialState.map((row) => [...row]);
    } else {
      this.state = [
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
    const prev = this.getState();

    this.state.forEach((row, index) => {
      this.mergeRow(row, index);
    });

    if (JSON.stringify(prev) !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.checkWin();

      if (this.status !== 'win' && !this.hasMoves()) {
        this.status = 'lose';
      }
    }
  }
  moveRight() {
    const prev = this.getState();

    this.state.forEach((row, index) => {
      const reverseRow = row.reverse();

      this.mergeRow(reverseRow, index);
    });

    this.state.forEach((row) => row.reverse());

    if (JSON.stringify(prev) !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.checkWin();

      if (this.status !== 'win' && !this.hasMoves()) {
        this.status = 'lose';
      }
    }
  }
  moveUp() {
    const prev = this.getState();

    this.transpose();

    this.state.forEach((row, index) => {
      this.mergeRow(row, index);
    });
    this.transpose();

    if (JSON.stringify(prev) !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.checkWin();

      if (this.status !== 'win' && !this.hasMoves()) {
        this.status = 'lose';
      }
    }
  }
  moveDown() {
    const prev = this.getState();

    this.transpose();

    this.state.forEach((row, index) => {
      const reverseRow = row.reverse();

      this.mergeRow(reverseRow, index);
    });

    this.state.forEach((row) => row.reverse());
    this.transpose();

    if (JSON.stringify(prev) !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.checkWin();

      if (this.status !== 'win' && !this.hasMoves()) {
        this.status = 'lose';
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
    return this.state.map((row) => [...row]);
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
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
    this.start();
  }

  // Add your own methods here

  twoOrFour() {
    const rand = Math.random();

    if (rand < 0.1) {
      return 4;
    } else {
      return 2;
    }
  }

  addRandomTile() {
    const min = 0;
    const empty = [];

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const max = empty.length - 1;

    const randomCell = Math.floor(Math.random() * (max - min + 1) + min);

    this.state[empty[randomCell][0]][empty[randomCell][1]] = this.twoOrFour();
  }

  mergeRow(row, index) {
    const compact = row.filter((el) => el !== 0);

    for (let i = 0; i < compact.length; i++) {
      if (compact[i] === compact[i + 1]) {
        compact[i] *= 2;
        compact[i + 1] = 0;
        this.score += compact[i];
        i++;
      }
    }

    const merged = compact.filter((el) => el !== 0);

    while (merged.length < 4) {
      merged.push(0);
    }

    this.state[index] = merged;
  }

  transpose() {
    const newState = [];

    for (let r = 0; r < this.state.length; r++) {
      newState[r] = [];

      for (let c = 0; c < this.state[r].length; c++) {
        newState[r][c] = this.state[c][r];
      }
    }

    this.state = newState;
  }

  checkWin() {
    if (this.state.some((row) => row.some((el) => el === 2048))) {
      this.status = 'win';
    }
  }

  hasMoves() {
    const checkState = this.getState();

    if (checkState.some((row) => row.some((el) => el === 0)) === true) {
      return true;
    }

    for (let r = 0; r < checkState.length; r++) {
      for (let c = 0; c < checkState.length; c++) {
        if (
          c < checkState.length - 1 &&
          checkState[r][c] === checkState[r][c + 1]
        ) {
          return true;
        }

        if (
          r < checkState.length - 1 &&
          checkState[r][c] === checkState[r + 1][c]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
