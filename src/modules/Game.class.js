'use strict';

class Game {
  /**
   * Creates a new game instance.
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
  constructor(initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]) {
    this.initialState = initialState;
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    const oldState = this.getState();

    for (let y = 0; y < this.initialState.length; y++) {
      for (let x = 1; x < this.initialState.length; x++) {
        if (this.initialState[y][x] !== 0) {
          const numValue = this.initialState[y][x];

          for (let index = x - 1; index >= 0; index--) {
            if (numValue === this.initialState[y][index]) {
              this.initialState[y][x] = 0;
              this.initialState[y][index] = numValue * 2;
              this.score += numValue * 2;

              break;
            }

            if (this.initialState[y][index] !== 0) {
              this.initialState[y][x] = 0;
              this.initialState[y][index + 1] = numValue;

              break;
            }

            if (index === 0) {
              this.initialState[y][x] = 0;
              this.initialState[y][index] = numValue;
            }
          }
        }
      }
    }

    if (JSON.stringify(oldState) !== JSON.stringify(this.initialState)
      && this.hasValue(0)) {
      this.generateTwoOrFour();
    }
  }

  moveRight() {
    const oldState = this.getState();

    for (let y = 0; y < this.initialState.length; y++) {
      for (let x = this.initialState.length - 2; x >= 0; x--) {
        if (this.initialState[y][x] !== 0) {
          const numValue = this.initialState[y][x];

          for (let index = x + 1; index < this.initialState.length; index++) {
            if (numValue === this.initialState[y][index]) {
              this.initialState[y][x] = 0;
              this.initialState[y][index] = numValue * 2;
              this.score += numValue * 2;

              break;
            }

            if (this.initialState[y][index] !== 0) {
              this.initialState[y][x] = 0;
              this.initialState[y][index - 1] = numValue;

              break;
            }

            if (index === this.initialState.length - 1) {
              this.initialState[y][x] = 0;
              this.initialState[y][index] = numValue;
            }
          }
        }
      }
    }

    if (JSON.stringify(oldState) !== JSON.stringify(this.initialState)
      && this.hasValue(0)) {
      this.generateTwoOrFour();
    }
  }

  moveUp() {
    const oldState = this.getState();

    for (let x = 0; x < this.initialState.length; x++) {
      for (let y = 1; y < this.initialState.length; y++) {
        if (this.initialState[y][x] !== 0) {
          const numValue = this.initialState[y][x];

          for (let index = y - 1; index >= 0; index--) {
            if (numValue === this.initialState[index][x]) {
              this.initialState[y][x] = 0;
              this.initialState[index][x] = numValue * 2;
              this.score += numValue * 2;

              break;
            }

            if (this.initialState[index][x] !== 0) {
              this.initialState[y][x] = 0;
              this.initialState[index + 1][x] = numValue;

              break;
            }

            if (index === 0) {
              this.initialState[y][x] = 0;
              this.initialState[index][x] = numValue;
            }
          }
        }
      }
    }

    if (JSON.stringify(oldState) !== JSON.stringify(this.initialState)
      && this.hasValue(0)) {
      this.generateTwoOrFour();
    }
  }

  moveDown() {
    const oldState = this.getState();

    for (let x = 0; x < this.initialState.length; x++) {
      for (let y = this.initialState.length - 2; y >= 0; y--) {
        if (this.initialState[y][x] !== 0) {
          const numValue = this.initialState[y][x];

          for (let index = y + 1; index < this.initialState.length; index++) {
            if (numValue === this.initialState[index][x]) {
              this.initialState[y][x] = 0;
              this.initialState[index][x] = numValue * 2;
              this.score += numValue * 2;

              break;
            }

            if (this.initialState[index][x] !== 0) {
              this.initialState[y][x] = 0;
              this.initialState[index - 1][x] = numValue;

              break;
            }

            if (index === this.initialState.length - 1) {
              this.initialState[y][x] = 0;
              this.initialState[index][x] = numValue;
            }
          }
        }
      }
    }

    if (JSON.stringify(oldState) !== JSON.stringify(this.initialState)
      && this.hasValue(0)) {
      this.generateTwoOrFour();
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
    return this.initialState;
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
    if (this.status === 'playing') {
      if (this.hasValue(2048)) {
        this.status = 'win';

        return this.status;
      }

      if (!this.hasValue(0)) {
        for (let y = 0; y < this.initialState.length; y++) {
          for (let x = 0; x < this.initialState[y].length; x++) {
            const up = y < this.initialState.length - 2
              ? this.initialState[y + 1][x]
              : null;
            const down = y >= 1
              ? this.initialState[y - 1][x]
              : null;
            const right = x < this.initialState.length - 2
              ? this.initialState[y][x + 1]
              : null;
            const left = x >= 1
              ? this.initialState[y][x - 1]
              : null;

            if (this.initialState[y][x] === up
              || this.initialState[y][x] === down
              || this.initialState[y][x] === right
              || this.initialState[y][x] === left) {
              return this.status;
            }
          }
        }
        this.status = 'lose';
      }
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    if (this.initialState.every(row =>
      row.every(item => item === 0))) {
      for (let i = 0; i <= 1; i++) {
        if (this.hasValue(0)) {
          this.generateTwoOrFour();
        }
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';

    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  generateTwoOrFour() {
    const row = Math.floor(Math.random() * this.initialState.length);
    const col = Math.floor(Math.random() * this.initialState[0].length);

    const num = Math.random() < 0.9 ? 2 : 4;

    if (this.initialState[row][col] === 0) {
      this.initialState[row][col] = num;
    } else {
      this.generateTwoOrFour();
    }
  }

  colorCells(board) {
    for (let y = 0; y < this.initialState.length; y++) {
      const row = board.rows[y];

      for (let x = 0; x < this.initialState[0].length; x++) {
        const cell = row.cells[x];

        cell.className = cell.className
          .split(' ')
          .filter(className => !className.startsWith('field-cell--'))
          .join(' ');

        if (this.initialState[y][x] !== 0) {
          cell.classList.add(`field-cell--${this.initialState[y][x]}`);
          cell.textContent = `${this.initialState[y][x]}`;
        } else {
          cell.textContent = '';
        }
      }
    }
  }

  hasValue(value) {
    for (let y = 0; y < this.initialState.length; y++) {
      for (let x = 0; x < this.initialState[y].length; x++) {
        if (this.initialState[y][x] === value) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
