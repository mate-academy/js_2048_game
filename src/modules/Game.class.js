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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this._initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));

    this.state = this._initialState.map((row) => [...row]);

    // // eslint-disable-next-line no-console
    // console.log(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);
    let gainedPoints = 0;

    for (let r = 0; r < this.size; r++) {
      const { newMergedRow, points } = this._slideAndMergeRow(this.state[r]);

      this.state[r] = newMergedRow;
      gainedPoints += points;
    }

    if (JSON.stringify(this.state) !== oldState) {
      this.score += gainedPoints;
      this._addRandomTile();
    }
    this._checkStatus();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);
    let gainedPoints = 0;

    for (let r = 0; r < this.size; r++) {
      const reversedRow = [...this.state[r]].reverse();
      const { newMergedRow, points } = this._slideAndMergeRow(reversedRow);

      this.state[r] = newMergedRow.reverse();
      gainedPoints += points;
    }

    if (JSON.stringify(this.state) !== oldState) {
      this.score += gainedPoints;
      this._addRandomTile();
    }
    this._checkStatus();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);
    let gainedPoints = 0;

    for (let c = 0; c < this.size; c++) {
      const column = this.state.map((row) => row[c]);
      const { newMergedRow, points } = this._slideAndMergeRow(column);

      for (let r = 0; r < this.size; r++) {
        this.state[r][c] = newMergedRow[r];
      }
      gainedPoints += points;
    }

    if (JSON.stringify(this.state) !== oldState) {
      this.score += gainedPoints;
      this._addRandomTile();
    }
    this._checkStatus();
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);
    let gainedPoints = 0;

    for (let c = 0; c < this.size; c++) {
      const column = this.state.map((row) => row[c]).reverse();
      const { newMergedRow, points } = this._slideAndMergeRow(column);
      const mergedReversed = newMergedRow.reverse();

      for (let r = 0; r < this.size; r++) {
        this.state[r][c] = mergedReversed[r];
      }
      gainedPoints += points;
    }

    if (JSON.stringify(this.state) !== oldState) {
      this.score += gainedPoints;
      this._addRandomTile();
    }
    this._checkStatus();
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

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  _slideAndMergeRow(row) {
    const numbers = row.filter((num) => num !== 0);

    const mergedRow = [];
    let points = 0;

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const mergedValue = numbers[i] * 2;

        mergedRow.push(mergedValue);
        points += mergedValue;
        i++;
      } else {
        mergedRow.push(numbers[i]);
      }
    }

    while (mergedRow.length < this.size) {
      mergedRow.push(0);
    }

    return { newMergedRow: mergedRow, points };
  }

  _checkStatus() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === 0) {
          this.status = 'playing';

          return;
        }
      }
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        const current = this.state[r][c];

        if (current === this.state[r][c + 1] && c < this.size - 1) {
          this.status = 'playing';

          return;
        }

        if (r < this.size - 1 && current === this.state[r + 1][c]) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }
  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.status = 'playing';

    if (
      !this.state ||
      this.state.every((row) => row.every((cell) => cell === 0))
    ) {
      this.state = Array.from(
        { length: this.size },
        () => Array(this.size).fill(0), // <- no trailing comma here
      );
    }
    this._addRandomTile();
    this._addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';

    this.state = this._initialState.map((row) => [...row]);
  }

  // Add your own methods here
}

module.exports = Game;
