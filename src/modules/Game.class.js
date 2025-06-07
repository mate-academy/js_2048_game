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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.rows = document.getElementsByClassName('field-row');
    this.scoreEl = document.getElementsByClassName('game-score');
  }

  moveLeft() {
    const size = this.size;
    const cells = document.querySelectorAll('.field-cell');
    let sumScore = 0;
    let moved = false;

    for (let row = 0; row < size; row++) {
      let values = [];

      for (let col = 0; col < size; col++) {
        const val = this.board[row][col];

        if (val !== 0) {
          values.push(val);
        }
      }

      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          sumScore += values[i];
          values[i + 1] = 0;
          i++;
        }
      }

      values = values.filter((val) => val !== 0);

      while (values.length < size) {
        values.push(0);
      }

      for (let col = 0; col < size; col++) {
        if (this.board[row][col] !== values[col]) {
          moved = true;
        }
        this.board[row][col] = values[col];
      }
    }

    if (moved) {
      this.score += sumScore;
      this.addRandomTile();

      for (let i = 0; i < size * size; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        const val = this.board[row][col];
        const cell = cells[i];

        cell.textContent = val === 0 ? '' : val;
        cell.className = 'field-cell';

        if (val !== 0) {
          cell.classList.add(`field-cell--${val}`);
        }

        if (this.checkWin()) {
          this.status = 'win';
        } else if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }

  moveRight() {
    const size = this.size;
    const cells = document.querySelectorAll('.field-cell');
    let sumScore = 0;
    let moved = false;

    for (let row = 0; row < size; row++) {
      let values = [];

      for (let col = size - 1; col >= 0; col--) {
        const val = this.board[row][col];

        if (val !== 0) {
          values.push(val);
        }
      }

      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          sumScore += values[i];
          values[i + 1] = 0;
          i++;
        }
      }

      values = values.filter((val) => val !== 0);

      while (values.length < size) {
        values.push(0);
      }

      for (let col = size - 1, i = 0; col >= 0; col--, i++) {
        if (this.board[row][col] !== values[i]) {
          moved = true;
        }
        this.board[row][col] = values[i];
      }
    }

    if (moved) {
      this.score += sumScore;
      this.addRandomTile();

      for (let i = 0; i < size * size; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        const val = this.board[row][col];
        const cell = cells[i];

        cell.textContent = val === 0 ? '' : val;
        cell.className = 'field-cell';

        if (val !== 0) {
          cell.classList.add(`field-cell--${val}`);
        }

        if (this.checkWin()) {
          this.status = 'win';
        } else if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }

  moveUp() {
    const size = this.size;
    const cells = document.querySelectorAll('.field-cell');
    let sumScore = 0;
    let moved = false;

    for (let col = 0; col < size; col++) {
      let values = [];

      for (let row = 0; row < size; row++) {
        const val = this.board[row][col];

        if (val !== 0) {
          values.push(val);
        }
      }

      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
          values[i] = values[i] * 2;
          sumScore += values[i];
          values[i + 1] = 0;
          i++;
        }
      }

      values = values.filter((val) => val !== 0);

      while (values.length < size) {
        values.push(0);
      }

      for (let row = 0; row < size; row++) {
        if (this.board[row][col] !== values[row]) {
          moved = true;
        }
        this.board[row][col] = values[row];
      }
    }

    if (moved) {
      this.score += sumScore;
      this.addRandomTile();

      for (let i = 0; i < size * size; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        const val = this.board[row][col];
        const cell = cells[i];

        cell.textContent = val === 0 ? '' : val;
        cell.className = 'field-cell';

        if (val !== 0) {
          cell.classList.add(`field-cell--${val}`);
        }

        if (this.checkWin()) {
          this.status = 'win';
        } else if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }

  moveDown() {
    const size = this.size;
    const cells = document.querySelectorAll('.field-cell');
    let sumScore = 0;
    let moved = false;

    for (let col = 0; col < size; col++) {
      let values = [];

      for (let row = size - 1; row >= 0; row--) {
        const val = this.board[row][col];

        if (val !== 0) {
          values.push(val);
        }
      }

      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          sumScore += values[i];
          values[i + 1] = 0;
          i++;
        }
      }

      values = values.filter((val) => val !== 0);

      while (values.length < size) {
        values.push(0);
      }

      for (let row = size - 1, i = 0; row >= 0; row--, i++) {
        if (this.board[row][col] !== values[i]) {
          moved = true;
        }
        this.board[row][col] = values[i];
      }
    }

    if (moved) {
      this.score += sumScore;
      this.addRandomTile();

      for (let i = 0; i < size * size; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        const val = this.board[row][col];
        const cell = cells[i];

        cell.textContent = val === 0 ? '' : val;
        cell.className = 'field-cell';

        if (val !== 0) {
          cell.classList.add(`field-cell--${val}`);
        }

        if (this.checkWin()) {
          this.status = 'win';
        } else if (!this.canMove()) {
          this.status = 'lose';
        }
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.clearBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ row: r, col: c });
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const { row, col } = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  render() {
    const cells = document.querySelectorAll('.field-cell');

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const index = row * this.size + col;
        const val = this.board[row][col];
        const cell = cells[index];

        cell.textContent = val === 0 ? '' : val;
        cell.className = 'field-cell';

        if (val !== 0) {
          cell.classList.add(`field-cell--${val}`);
        }
      }
    }

    for (const el of this.scoreEl) {
      el.textContent = this.score;
    }
  }

  clearBoard() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.board[row][col] = 0;
      }
    }
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size - 1; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
