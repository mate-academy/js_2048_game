/* eslint-disable no-lone-blocks */
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
    this.score = 0;
    this.level = 0;
    this.target = 16;
    this.status = 'idle';
    this.initialState = initialState;
    // this.state = this.initialState;
    this.state = this.copyState(this.initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move('left');

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move('right');

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move('up');

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move('down');

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
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
    this.state = this.copyState(this.initialState);
    // this.state = this.initialState;
    this.score = 0;
    this.level = 0;
    this.target = 16;
    this.status = 'idle';
  }
  addRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          emptyTiles.push([row, column]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);

      const [row, column] = emptyTiles[randomIndex];

      this.state[row][column] = Math.random() < 0.9 ? 2 : 4;
    }
  }
  copyState(state) {
    return state.map((row) => [...row]);
  }

  move(direction) {
    const originalState = [...this.state];
    // const originalState = this.copyState(this.state);

    const combineRow = (row) => {
      const newRow = row.filter((n) => n !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
        }
      }

      return newRow.filter((n) => n !== 0);
    };

    const moveRowLeft = (row) => {
      const newRow = combineRow(row);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      return newRow;
    };

    const moveRowRight = (row) => {
      const copyRow = [...row];

      const newRow = combineRow(copyRow.reverse());

      while (newRow.length < 4) {
        newRow.push(0);
      }

      return newRow.reverse();
    };

    const moveStateLeft = (state) => {
      return state.map((row) => moveRowLeft(row));
    };

    const moveStateRight = (state) => {
      return state.map((row) => moveRowRight(row));
    };

    switch (direction) {
      case 'left':
        this.state = moveStateLeft(this.state);
        break;

      case 'right':
        this.state = moveStateRight(this.state);
        break;

      case 'up':
        this.state = this.transposeState(
          moveStateLeft(this.transposeState(this.state)),
        );
        break;

      case 'down':
        this.state = this.transposeState(
          moveStateRight(this.transposeState(this.state)),
        );
        break;
    }

    return !this.areStatesEqual(this.state, originalState);
  }

  hasEmptyCells() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  canCombine() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        const current = this.state[row][column];

        if (column < 3 && current === this.state[row][column + 1]) {
          return true;
        }

        if (row < 3 && current === this.state[row + 1][column]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameState() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] >= 16 && this.level < 1) {
          this.level = 1;
          this.target = 32;
        }

        if (this.state[row][column] >= 32 && this.level < 2) {
          this.level = 2;
          this.target = 64;
        }

        if (this.state[row][column] >= 64 && this.level < 3) {
          this.level = 3;
          this.target = 128;
        }

        if (this.state[row][column] >= 128 && this.level < 4) {
          this.level = 4;
          this.target = 256;
        }

        if (this.state[row][column] >= 256 && this.level < 5) {
          this.level = 5;
          this.target = 512;
        }

        if (this.state[row][column] >= 512 && this.level < 6) {
          this.level = 6;
          this.target = 1024;
        }

        if (this.state[row][column] >= 1024 && this.level < 7) {
          this.level = 7;
          this.target = 2048;
        }

        if (this.state[row][column] === 2048) {
          this.level++;
          this.status = 'win';

          return;
        }
      }
    }

    if (this.hasEmptyCells() || this.canCombine()) {
      return;
    }
    this.status = 'lose';
  }

  transposeState(state) {
    const result = [];

    for (let column = 0; column < 4; column++) {
      result[column] = [];

      for (let row = 0; row < 4; row++) {
        result[column].push(state[row][column]);
      }
    }

    return result;
  }

  areStatesEqual(state1, state2) {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (state1[row][column] !== state2[row][column]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
