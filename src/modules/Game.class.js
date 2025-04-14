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

  statusEnum = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = this.initialState.map((row) => row.slice());

    this.status = this.statusEnum.idle;
    this.score = 0;
  }

  moveUp() {
    if (this.status === this.statusEnum.playing) {
      let isMoved = false;

      for (let column = 0; column < 4; column++) {
        const valuesOfColumn = [];

        for (let row = 0; row < 4; row++) {
          if (this.state[row][column] !== 0) {
            valuesOfColumn.push(this.state[row][column]);
          }
        }

        for (let i = 0; i < valuesOfColumn.length; i++) {
          if (valuesOfColumn[i] === valuesOfColumn[i + 1]) {
            valuesOfColumn[i] *= 2;
            valuesOfColumn[i + 1] = 0;
            this.score += valuesOfColumn[i];
            isMoved = true;
          }
        }

        const newColumn = valuesOfColumn.filter((value) => value !== 0);

        while (newColumn.length < 4) {
          newColumn.push(0);
        }

        for (let row = 0; row < 4; row++) {
          if (this.state[row][column] !== newColumn[row]) {
            this.state[row][column] = newColumn[row];
            isMoved = true;
          }
        }
      }

      if (isMoved) {
        this.addTile();
        this.checkStatus();
      }
    }
  }
  moveDown() {
    if (this.status === this.statusEnum.playing) {
      let isMoved = false;

      for (let column = 0; column < 4; column++) {
        const valuesOfColumn = [];

        for (let row = 3; row >= 0; row--) {
          if (this.state[row][column] !== 0) {
            valuesOfColumn.push(this.state[row][column]);
          }
        }

        for (let i = 0; i < valuesOfColumn.length; i++) {
          if (valuesOfColumn[i] === valuesOfColumn[i + 1]) {
            valuesOfColumn[i] *= 2;
            valuesOfColumn[i + 1] = 0;
            isMoved = true;
            this.score += valuesOfColumn[i];
          }
        }

        const newColumn = valuesOfColumn.filter((value) => value !== 0);

        while (newColumn.length < 4) {
          newColumn.push(0);
        }

        for (let row = 0; row < 4; row++) {
          if (this.state[row][column] !== newColumn[3 - row]) {
            this.state[row][column] = newColumn[3 - row];
            isMoved = true;
          }
        }
      }

      if (isMoved) {
        this.addTile();
        this.checkStatus();
      }
    }
  }
  moveLeft() {
    if (this.status === this.statusEnum.playing) {
      let isMoved = false;

      for (let row = 0; row < 4; row++) {
        const valuesOfRows = [];

        for (let column = 0; column < 4; column++) {
          if (this.state[row][column] !== 0) {
            valuesOfRows.push(this.state[row][column]);
          }
        }

        for (let i = 0; i < valuesOfRows.length; i++) {
          if (valuesOfRows[i] === valuesOfRows[i + 1]) {
            valuesOfRows[i] *= 2;
            valuesOfRows[i + 1] = 0;
            isMoved = true;
            this.score += valuesOfRows[i];
          }
        }

        const newRow = valuesOfRows.filter((value) => value !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        for (let column = 0; column < 4; column++) {
          if (this.state[row][column] !== newRow[column]) {
            this.state[row][column] = newRow[column];
            isMoved = true;
          }
        }
      }

      if (isMoved) {
        this.addTile();
        this.checkStatus();
      }
    }
  }
  moveRight() {
    if (this.status === this.statusEnum.playing) {
      let isMoved = false;

      for (let row = 0; row < 4; row++) {
        const valuesOfRows = [];

        for (let column = 3; column >= 0; column--) {
          if (this.state[row][column] !== 0) {
            valuesOfRows.push(this.state[row][column]);
          }
        }

        for (let i = 0; i < valuesOfRows.length; i++) {
          if (valuesOfRows[i] === valuesOfRows[i + 1]) {
            valuesOfRows[i] *= 2;
            valuesOfRows[i + 1] = 0;
            isMoved = true;
            this.score += valuesOfRows[i];
          }
        }

        const newRow = valuesOfRows.filter((value) => value !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        for (let column = 0; column < 4; column++) {
          if (this.state[row][column] !== newRow[3 - column]) {
            this.state[row][column] = newRow[3 - column];
            isMoved = true;
          }
        }
      }

      if (isMoved) {
        this.addTile();
        this.checkStatus();
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
    this.status = this.statusEnum.playing;
    this.addTile();
    this.addTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = this.statusEnum.idle;
    this.state = this.initialState.map((row) => row.slice());
    this.score = 0;
    // this.getState();
    // console.log(this.state);
  }

  // Add your own methods here

  addTile() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          emptyTiles.push([row, column]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const [randomRow, randomColumn] =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.state[randomRow][randomColumn] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkStatus() {
    let hasMoves = false;
    let hasEmptyTiles = false;

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 2048) {
          this.status = this.statusEnum.win;

          return;
        }

        if (this.state[row][column] === 0) {
          hasEmptyTiles = true;
        }

        if (
          (row < 3 &&
            this.state[row][column] === this.state[row + 1][column]) ||
          (column < 3 &&
            this.state[row][column] === this.state[row][column + 1])
        ) {
          hasMoves = true;
        }
      }
    }

    if (!hasEmptyTiles && !hasMoves) {
      this.status = this.statusEnum.lose;
    }
  }
}

module.exports = Game;
