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
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.getStatus() === 'idle') {
      return;
    }

    for (let i = 0; i < this.state.length; i++) {
      let row = this.state[i].filter((el) => el !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.score += row[j];
        }
      }

      row = row.filter((el) => el !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      this.state[i] = row;
    }
  }

  moveRight() {
    if (this.getStatus() === 'idle') {
      return;
    }

    for (let i = 0; i < this.state.length; i++) {
      let row = this.state[i].filter((el) => el !== 0);

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          row[j - 1] = 0;
          this.score += row[j];
        }
      }

      row = row.filter((el) => el !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }

      this.state[i] = row;
    }
  }

  moveUp() {
    if (this.getStatus() === 'idle') {
      return;
    }

    const size = this.state.length;

    for (let col = 0; col < size; col++) {
      let column = [];

      for (let row = 0; row < size; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          i++;
        }
      }

      column = column.filter((el) => el !== 0);

      while (column.length < size) {
        column.push(0);
      }

      for (let row = 0; row < size; row++) {
        this.state[row][col] = column[row];
      }
    }
  }

  moveDown() {
    if (this.getStatus() === 'idle') {
      return;
    }

    const size = this.state.length;

    for (let col = 0; col < size; col++) {
      let column = [];

      for (let row = 0; row < size; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      column.reverse();

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          i++;
        }
      }

      column = column.filter((el) => el !== 0);

      while (column.length < size) {
        column.push(0);
      }

      column.reverse();

      for (let row = 0; row < size; row++) {
        this.state[row][col] = column[row];
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
    if (this.status === 'idle') {
      return 'idle';
    }

    for (const row of this.state) {
      if (row.includes(2048)) {
        return 'win';
      }
    }

    if (this.hasMoves()) {
      return 'playing';
    }

    return 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    this.restart();
    this.status = 'playing';
    this.random();
    this.random();
  }

  /**
   * Resets the game.
   */
  restart() {
    // this.state = [
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    // ];
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  random() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return this.state;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = value;

    return this.state;
  }

  hasMoves() {
    const size = this.state.length;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const value = this.state[row][col];

        if (value === 0) {
          return true;
        }

        if (
          (row > 0 && this.state[row - 1][col] === value) ||
          (row < size - 1 && this.state[row + 1][col] === value) ||
          (col > 0 && this.state[row][col - 1] === value) ||
          (col < size - 1 && this.state[row][col + 1] === value)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  render() {
    const flat = this.state.flat();
    const cells = [...document.querySelectorAll('.field-cell')];

    cells.forEach((cell, index) => {
      const value = flat[index];

      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  }
}

module.exports = Game;
