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
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.initialState = initialState.map((row) => [...row]);
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.state = this.initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    for (let r = 0; r < 4; r++) {
      this.state[r] = this.slideRow(this.state[r]);
    }

    const changed = this.state.some((row, r) => {
      return row.some((cell, c) => cell !== prevState[r][c]);
    });

    if (changed) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    for (let r = 0; r < 4; r++) {
      this.state[r] = this.slideRow([...this.state[r]].reverse()).reverse();
    }

    const changed = this.state.some((row, r) => {
      return row.some((cell, c) => cell !== prevState[r][c]);
    });

    if (changed) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    this.transpose();

    for (let r = 0; r < 4; r++) {
      this.state[r] = this.slideRow(this.state[r]);
    }

    this.transpose();

    const changed = this.state.some((row, r) => {
      return row.some((cell, c) => cell !== prevState[r][c]);
    });

    if (changed) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    this.transpose();

    for (let r = 0; r < 4; r++) {
      this.state[r] = this.slideRow([...this.state[r]].reverse()).reverse();
    }

    this.transpose();

    const changed = this.state.some((row, r) => {
      return row.some((cell, c) => cell !== prevState[r][c]);
    });

    if (changed) {
      this.addRandomTile();
    }

    this.updateStatus();
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.state = this.initialState.map((row) => [...row]);
  }

  // Add your own methods here.

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r: row, c: col } = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  slideRow(row) {
    const cells = row.filter((cell) => cell !== 0);

    const merged = [];

    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === cells[i + 1]) {
        const value = cells[i] * 2;

        merged.push(value);
        this.score += value;
        i++;
      } else {
        merged.push(cells[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
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

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.state[r][c];

        if (c < 3 && this.state[r][c + 1] === val) {
          return;
        }

        if (r < 3 && this.state[r + 1][c] === val) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  transpose() {
    this.state = this.state[0].map((_, col) => {
      return this.state.map((row) => row[col]);
    });
  }
}

export default Game;
