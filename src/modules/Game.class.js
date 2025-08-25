'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

const arraysEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = initialState;
    }
  }

  mergeLine(line) {
    const nums = line.filter((num) => num > 0);

    const sum = [];

    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === nums[i + 1]) {
        const merged = nums[i] + nums[i + 1];

        sum.push(merged);
        this.score += merged;
        i++;
      } else {
        sum.push(nums[i]);
      }
    }

    const zerosToAdd = line.length - sum.length;

    for (let i = 0; i < zerosToAdd; i++) {
      sum.push(0);
    }

    return sum;
  }

  moveLeft() {
    let changed = false;

    for (let i = 0; i < this.board.length; i++) {
      const merged = this.mergeLine(this.board[i]);

      if (!arraysEqual(this.board[i], merged)) {
        changed = true;
      }

      this.board[i] = merged;
    }

    if (changed) {
      this.addRandomTile();
      this.render();
    }
  }

  moveRight() {
    let changed = false;

    for (let i = 0; i < this.board.length; i++) {
      const reversed = [...this.board[i]].reverse();
      const merged = this.mergeLine(reversed);
      const newRow = merged.reverse();

      if (!arraysEqual(this.board[i], newRow)) {
        changed = true;
      }

      this.board[i] = newRow;
    }

    if (changed) {
      this.addRandomTile();
      this.render();
    }
  }

  moveUp() {
    let changed = false;

    for (let col = 0; col < this.board[0].length; col++) {
      const column = this.board.map((row) => row[col]);
      const merged = this.mergeLine(column);

      if (!arraysEqual(column, merged)) {
        changed = true;
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = merged[row];
      }
    }

    if (changed) {
      this.addRandomTile();
      this.render();
    }
  }

  moveDown() {
    let changed = false;

    for (let col = 0; col < this.board[0].length; col++) {
      const column = this.board.map((row) => row[col]).reverse();
      const merged = this.mergeLine(column).reverse();

      if (
        !arraysEqual(
          this.board.map((row) => row[col]),
          merged,
        )
      ) {
        changed = true;
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = merged[row];
      }
    }

    if (changed) {
      this.addRandomTile();
      this.render();
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
    return this.board;
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
    const win = this.getState().some((row) =>
      row.some((cell) => cell === 2048));

    if (win) {
      return 'win';
    }

    for (let i = 0; i < this.getState().length; i++) {
      const row = this.getState()[i];

      for (let j = 0; j < this.getState()[i].length; j++) {
        const cell = row[j];

        if (j + 1 < row.length && cell === row[j + 1]) {
          return 'playing';
        }

        if (
          i + 1 < this.getState().length &&
          cell === this.getState()[i + 1][j]
        ) {
          return 'playing';
        }

        if (cell === 0) {
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
    this.status = 'playing';
    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  render() {
    const rows = document.querySelectorAll('.field-row');

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (row.nodeType === Node.ELEMENT_NODE) {
        for (let j = 0; j < row.children.length; j++) {
          const element = row.children[j];

          element.classList.forEach((elem) => {
            if (elem.startsWith('field-cell--')) {
              element.classList.remove(elem);
            }
          });

          const value = this.getState()[i][j];

          if (value === 0) {
            element.textContent = '';
          } else {
            element.classList.add(`field-cell--${value}`);
            element.textContent = value;
          }
        }
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    this.render();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const tileValue = Math.random() < 0.9 ? 2 : 4;
    const [row, col] = emptyCells[randomIndex];

    this.board[row][col] = tileValue;
  }
}

module.exports = Game;
