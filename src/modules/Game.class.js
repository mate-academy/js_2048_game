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
    // eslint-disable-next-line no-console
    this.initialState = initialState;
    this.state = [];

    for (let row = 0; row < 4; row++) {
      this.state[row] = [...initialState[row]];
    }
    this.gameStatus = 'idle';
    this.score = 0;
  }

  _render() {
    if (!this.rows || this.rows.length === 0) {
      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.state[row][col];
        const cell = this.rows[row]?.children[col];

        cell.textContent = value === 0 ? '' : value;

        cell.className = 'field-cell';

        if (value !== 0) {
          cell.classList.add(`field-cell--${value}`);
        }
      }
    }
  }

  initDom() {
    this.rows = document.querySelectorAll('.field-row');

    if (!this.rows.length) {
      throw new Error('Game board not found in DOM');
    }
  }

  moveLeft() {
    let moved = false;

    if (this.gameStatus !== 'playing') {
      return;
    }

    for (let r = 0; r < 4; r++) {
      const row = [...this.state[r]];
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (filteredRow[i] !== row[i]) {
          moved = true;
          break;
        }
      }

      this.state[r] = filteredRow;

      if (this.state[r].includes(2048)) {
        this.win();
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this._render();

    if (this.gameStatus === 'playing') {
      this.checkLose();
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    if (this.gameStatus !== 'playing') {
      return;
    }

    for (let r = 0; r < 4; r++) {
      const row = [...this.state[r]];
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i - 1, 1);
          i--;
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.unshift(0);
      }

      for (let i = 0; i < 4; i++) {
        if (filteredRow[i] !== row[i]) {
          moved = true;
          break;
        }
      }

      this.state[r] = filteredRow;

      if (this.state[r].includes(2048)) {
        this.win();
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this._render();

    if (this.gameStatus === 'playing') {
      this.checkLose();
    }

    return moved;
  }
  moveUp() {
    let moved = false;

    if (this.gameStatus !== 'playing') {
      return;
    }

    for (let col = 0; col < 4; col++) {
      const column = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];
      const filteredColumn = column.filter((num) => num !== 0);

      for (let i = 0; i < filteredColumn.length - 1; i++) {
        if (filteredColumn[i] === filteredColumn[i + 1]) {
          filteredColumn[i] *= 2;
          this.score += filteredColumn[i];
          filteredColumn.splice(i + 1, 1);
        }
      }

      while (filteredColumn.length < 4) {
        filteredColumn.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (filteredColumn[i] !== column[i]) {
          moved = true;
          break;
        }
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = filteredColumn[row];

        if (this.state[row][col] === 2048) {
          this.win();
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this._render();

    if (this.gameStatus === 'playing') {
      this.checkLose();
    }

    return moved;
  }
  moveDown() {
    let moved = false;

    if (this.gameStatus !== 'playing') {
      return;
    }

    for (let col = 0; col < 4; col++) {
      const column = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];
      const filteredColumn = column.filter((num) => num !== 0);

      for (let i = filteredColumn.length - 1; i > 0; i--) {
        if (filteredColumn[i] === filteredColumn[i - 1]) {
          filteredColumn[i] *= 2;
          this.score += filteredColumn[i];
          filteredColumn.splice(i - 1, 1);
          i--;
        }
      }

      while (filteredColumn.length < 4) {
        filteredColumn.unshift(0);
      }

      for (let i = 0; i < 4; i++) {
        if (filteredColumn[i] !== column[i]) {
          moved = true;
          break;
        }
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = filteredColumn[row];

        if (this.state[row][col] === 2048) {
          this.win();
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this._render();

    if (this.gameStatus === 'playing') {
      this.checkLose();
    }

    return moved;
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.addRandomTile();
    this.addRandomTile();
    this._render();
    this.gameStatus = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [];

    for (let row = 0; row < 4; row++) {
      this.state[row] = [...this.initialState[row]];
    }

    this.score = 0;
    this.gameStatus = 'idle';
    this._render();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length !== 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row: r, col: c } = emptyCells[randomIndex];

      this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return;
        }
      }
    }

    this.lose();
  }

  win() {
    this.gameStatus = 'win';
  }

  lose() {
    this.gameStatus = 'lose';
  }
}

export default Game;
