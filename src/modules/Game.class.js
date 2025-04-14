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

    // eslint-disable-next-line no-console
  }

  updateUI() {
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = this.state[row][col];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });

    document.querySelector('.game-score').textContent = this.score;
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      const newValue = Math.random() < 0.9 ? 2 : 4;

      this.state[row][col] = newValue;
    }
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.state[row].filter((value) => value !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow[col + 1] = 0;
        }
      }

      const filteredRow = newRow.filter((value) => value !== 0);

      while (filteredRow.length < 4) {
        filteredRow.unshift(0);
      }

      if (filteredRow.toString() !== this.state[row].toString()) {
        this.state[row] = filteredRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateUI();
    }
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.state[row].filter((value) => value !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow[col + 1] = 0;
        }
      }

      const filteredRow = newRow.filter((value) => value !== 0);

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      if (filteredRow.toString() !== this.state[row].toString()) {
        this.state[row] = filteredRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateUI();
    }
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          newCol.push(this.state[row][col]);
        }
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol[i + 1] = 0;
        }
      }

      const filteredCol = newCol.filter((value) => value !== 0);

      while (filteredCol.length < 4) {
        filteredCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== filteredCol[row]) {
          this.state[row][col] = filteredCol[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateUI();
    }
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const newCol = [];

      for (let row = 3; row >= 0; row--) {
        if (this.state[row][col] !== 0) {
          newCol.push(this.state[row][col]);
        }
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol[i + 1] = 0;
        }
      }

      const filteredCol = newCol.filter((value) => value !== 0);

      while (filteredCol.length < 4) {
        filteredCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.state[3 - row][col] !== filteredCol[row]) {
          this.state[3 - row][col] = filteredCol[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateUI();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}

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
    let hasEmptyTile = false;
    let canMerge = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return 'win';
        }

        if (this.state[row][col] === 0) {
          hasEmptyTile = true;
        }

        if (
          (row < 3 && this.state[row][col] === this.state[row + 1][col]) ||
          (col < 3 && this.state[row][col] === this.state[row][col + 1])
        ) {
          canMerge = true;
        }
      }
    }

    if (!hasEmptyTile && !canMerge) {
      this.status = 'lose';

      return 'lose';
    } else {
      this.status = 'playing';

      return 'playing';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateUI();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();

    this.updateUI();
    this.getStatus();
  }
}

module.exports = Game;
