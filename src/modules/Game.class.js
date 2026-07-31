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
    this.defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : this.defaultState.map((row) => [...row]);

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    const isEmpty = this.state.every((row) => row.every((cell) => cell === 0));

    if (isEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }

    this.status = this.checkStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
    this.status = 'playing';

    const isEmpty = this.state.every((row) => row.every((cell) => cell === 0));

    if (isEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }

    this.status = this.checkStatus();
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    let changed = false;
    let moveScore = 0;
    const newGrid = Array.from({ length: 4 }, () => Array(4).fill(0));

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < 4; r++) {
        const row = [...this.state[r]];

        if (direction === 'right') {
          row.reverse();
        }

        const { newRow, score } = this.slideAndMerge(row);

        if (direction === 'right') {
          newRow.reverse();
        }

        moveScore += score;

        for (let c = 0; c < 4; c++) {
          newGrid[r][c] = newRow[c];
        }
      }
    } else if (direction === 'up' || direction === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [
          this.state[0][c],
          this.state[1][c],
          this.state[2][c],
          this.state[3][c],
        ];

        if (direction === 'down') {
          col.reverse();
        }

        const { newRow: newCol, score } = this.slideAndMerge(col);

        if (direction === 'down') {
          newCol.reverse();
        }

        moveScore += score;

        for (let r = 0; r < 4; r++) {
          newGrid[r][c] = newCol[r];
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (newGrid[r][c] !== this.state[r][c]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.state = newGrid;
      this.score += moveScore;
      this.addRandomTile();
      this.status = this.checkStatus();
    }

    return changed;
  }

  slideAndMerge(line) {
    const nonZero = line.filter((val) => val !== 0);
    const newRow = [];
    let score = 0;
    let i = 0;

    while (i < nonZero.length) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const mergedVal = nonZero[i] * 2;

        newRow.push(mergedVal);
        score += mergedVal;
        i += 2;
      } else {
        newRow.push(nonZero[i]);
        i += 1;
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, score };
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ r: row, c: col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex];

    this.state[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  checkStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] >= 2048) {
          return 'win';
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return 'playing';
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.state[r][c] === this.state[r][c + 1]) {
          return 'playing';
        }
      }
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === this.state[r + 1][c]) {
          return 'playing';
        }
      }
    }

    return 'lose';
  }
}

module.exports = Game;
