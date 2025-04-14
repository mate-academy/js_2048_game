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
  static STATUS_IDLE = 'idle';
  static STATUS_PLAYING = 'playing';
  static STATUS_WIN = 'win';
  static STATUS_LOSE = 'lose';
  static WINNING_TILE = 2048;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.STATUS_IDLE;
  }

  moveLeft() {
    if (this.status !== Game.STATUS_PLAYING) {
      return;
    }

    let stateChanged = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.slideAndMerge(this.state[row]);

      if (newRow.toString() !== this.state[row].toString()) {
        stateChanged = true;
      }

      this.state[row] = newRow;
    }

    if (stateChanged) {
      this.spawnTile();
    }

    this.checkLose();
    this.checkWin();
  }
  moveRight() {
    this.state = this.state.map((row) => row.reverse());
    this.moveLeft();
    this.state = this.state.map((row) => row.reverse());
  }
  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }
  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
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
    this.status = Game.STATUS_PLAYING;

    this.spawnTile();
    this.spawnTile();

    this.checkWin();
    this.checkLose();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.STATUS_IDLE;
  }

  // Add your own methods here
  spawnTile() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          emptyTiles.push({ row, column });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { row, column } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.state[row][column] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  transpose() {
    const transposedGrid = this.initialState.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        transposedGrid[column][row] = this.state[row][column];
      }
    }

    this.state = transposedGrid;
  }

  slideAndMerge(row) {
    let filteredRows = row.filter((element) => element !== 0);

    for (let i = 0; i < filteredRows.length - 1; i++) {
      if (filteredRows[i] === filteredRows[i + 1]) {
        filteredRows[i] *= 2;
        this.score += filteredRows[i];
        filteredRows[i + 1] = 0;
      }
    }

    filteredRows = filteredRows.filter((element) => element !== 0);

    while (filteredRows.length !== 4) {
      filteredRows.push(0);
    }

    return filteredRows;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === Game.WINNING_TILE) {
          this.status = Game.STATUS_WIN;
        }
      }
    }
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (
          (row < 3 &&
            this.state[row][column] === this.state[row + 1][column]) ||
          (column < 3 &&
            this.state[row][column] === this.state[row][column + 1])
        ) {
          return;
        }
      }
    }

    this.status = Game.STATUS_LOSE;
  }
}

module.exports = Game;
