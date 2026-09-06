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

    this.defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? this.cloneState(initialState)
      : this.defaultState;

    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.makeMove(() => {
      this.state = this.state.map((row) => this.slideRow(row));
    });
  }

  moveRight() {
    this.makeMove(() => {
      this.state = this.state.map((row) => {
        const reversed = [...row].reverse();
        const slided = this.slideRow(reversed);

        return slided.reverse();
      });
    });
  }

  moveUp() {
    this.makeMove(() => {
      let transposed = this.transpose(this.state);

      transposed = transposed.map((row) => this.slideRow(row));
      this.state = this.transpose(transposed);
    });
  }

  moveDown() {
    this.makeMove(() => {
      let transposed = this.transpose(this.state);

      transposed = transposed.map((row) => {
        const reversed = [...row].reverse();
        const slided = this.slideRow(reversed);

        return slided.reverse();
      });

      this.state = this.transpose(transposed);
    });
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
    this.score = 0;
    this.state = this.cloneState(this.initialState);

    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = this.cloneState(this.initialState);
  }

  // additional methods

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  spawnRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      this.lastSpawnedTile = null;

      return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;

    this.lastSpawnedTile = { row, col };

    return this.lastSpawnedTile;
  }

  getLastSpawnedTile() {
    return this.lastSpawnedTile;
  }

  slideRow(row) {
    let filtered = row.filter((val) => val !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((val) => val !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  makeMove(moveFunction) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.state);

    moveFunction();

    const currentState = JSON.stringify(this.state);

    if (previousState !== currentState) {
      this.spawnRandomTile();
      this.updateStatus();
    }
  }

  updateStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (this.canMove()) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
module.exports.default = Game;
