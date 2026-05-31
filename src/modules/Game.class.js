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
    if (initialState) {
      this.state = initialState.map((row) => [...row]);
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.initialState = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.state.length; i++) {
      const row = this.state[i];
      const mergedRow = this.mergeRow(row);

      if (JSON.stringify(row) !== JSON.stringify(mergedRow)) {
        moved = true;
      }
      this.state[i] = mergedRow;
    }

    if (moved) {
      this.addRandomTile();

      this.checkWin();
      this.checkLose();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.state.length; i++) {
      const row = this.state[i].slice().reverse();
      const mergedRow = this.mergeRow(row).reverse();

      if (JSON.stringify(this.state[i]) !== JSON.stringify(mergedRow)) {
        moved = true;
      }
      this.state[i] = mergedRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < this.state[0].length; col++) {
      const column = this.state.map((row) => row[col]);
      const mergedColumn = this.mergeRow(column);

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][col] !== mergedColumn[row]) {
          moved = true;
        }
        this.state[row][col] = mergedColumn[row];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < this.state[0].length; col++) {
      const column = this.state.map((row) => row[col]).reverse();
      const mergedColumn = this.mergeRow(column).reverse();

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][col] !== mergedColumn[row]) {
          moved = true;
        }
        this.state[row][col] = mergedColumn[row];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
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
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    if (this.initialState) {
      this.state = this.initialState.map((row) => [...row]);
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

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  mergeRow(row) {
    const mergedRow = row.filter((num) => num !== 0);

    for (let i = 0; i < mergedRow.length - 1; i++) {
      if (mergedRow[i] === mergedRow[i + 1]) {
        mergedRow[i] *= 2;
        this.score += mergedRow[i];
        mergedRow.splice(i + 1, 1);
      }
    }

    if (mergedRow.length < row.length) {
      mergedRow.push(...Array(row.length - mergedRow.length).fill(0));
    }

    return mergedRow;
  }
  checkWin() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }
  }

  checkLose() {
    for (const row of this.state) {
      if (row.includes(0)) {
        return;
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
