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
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.field = initialState;
    } else {
      this.field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  moveLeft() {
    const newField = [];

    for (const row of this.field) {
      newField.push(this._slideAndMergeRow(row));
    }

    let changed = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newField[i][j] !== this.field[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.field = newField;

      const emptyCells = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.field[row][col] === 0) {
            emptyCells.push([row, col]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const [r, c] =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];

        this.field[r][c] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  }
  moveRight() {
    const newField = [];

    for (const row of this.field) {
      const reversedRow = [...row].reverse();
      const newRow = this._slideAndMergeRow(reversedRow);

      newField.push(newRow.reverse());
    }

    let changed = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newField[i][j] !== this.field[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.field = newField;

      const emptyCells = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.field[row][col] === 0) {
            emptyCells.push([row, col]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const [r, c] =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];

        this.field[r][c] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  }
  moveUp() {
    const newField = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let j = 0; j < 4; j++) {
      const col = [
        this.field[0][j],
        this.field[1][j],
        this.field[2][j],
        this.field[3][j],
      ];
      const newCol = this._slideAndMergeRow(col);

      for (let i = 0; i < 4; i++) {
        newField[i][j] = newCol[i];
      }
    }

    let changed = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newField[i][j] !== this.field[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.field = newField;

      const emptyCells = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.field[row][col] === 0) {
            emptyCells.push([row, col]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const [r, c] =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];

        this.field[r][c] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  }
  moveDown() {
    const newField = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let j = 0; j < 4; j++) {
      const col = [
        this.field[0][j],
        this.field[1][j],
        this.field[2][j],
        this.field[3][j],
      ];
      const reversedCol = [...col].reverse();
      const newCol = this._slideAndMergeRow(reversedCol).reverse();

      for (let i = 0; i < 4; i++) {
        newField[i][j] = newCol[i];
      }
    }

    let changed = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newField[i][j] !== this.field[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.field = newField;

      const emptyCells = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.field[row][col] === 0) {
            emptyCells.push([row, col]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const [r, c] =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];

        this.field[r][c] = Math.random() < 0.9 ? 2 : 4;
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
    return this.field;
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

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 2048) {
          return 'win';
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 0) {
          return 'playing';
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.field[i][j] === this.field[i][j + 1] ||
          this.field[j][i] === this.field[j + 1][i]
        ) {
          return 'playing';
        }
      }
    }

    return 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.status = 'playing';

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 2; i++) {
      const emptyCells = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.field[row][col] === 0) {
            emptyCells.push([row, col]);
          }
        }
      }

      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.field[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  _slideAndMergeRow(row) {
    const filtered = row.filter((cell) => cell !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }
}

module.exports = Game;
