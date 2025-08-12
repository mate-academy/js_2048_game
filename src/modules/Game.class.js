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
    // eslint-disable-next-line
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0),);

    this.score = 0;
    this.status = 'idle';
    this.moves = 0;
  }

  insert() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    const total = emptyCells.length;

    if (total === 0) {
      return false;
    }

    const randomInd = Math.floor(Math.random() * total);
    const [row, col] = emptyCells[randomInd];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;

    return true;
  }

  _processLineLeft(line) {
    const compact = line.filter((v) => v !== 0);
    const merged = [];
    let gained = 0;

    let i = 0;

    while (i < compact.length) {
      if (i + 1 < compact.length && compact[i] === compact[i + 1]) {
        const val = compact[i] * 2;

        merged.push(val);
        gained += val;
        i += 2; // пропускаем обе, чтобы не было двойного мерджа
      } else {
        merged.push(compact[i]);
        i += 1;
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    const moved = merged.some((v, idx) => v !== line[idx]);

    return { nextLine: merged, moved, gained };
  }

  _has2048() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  _hasMoves() {
    if (this.board.some((row) => row.some((cell) => cell === 0))) {
      return true;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.board[r][c];

        if (c + 1 < this.size && this.board[r][c + 1] === v) {
          return true;
        }

        if (r + 1 < this.size && this.board[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    let anyMoved = false;
    let gainedTotal = 0;

    for (let i = 0; i < this.size; i++) {
      const line = this.board[i];
      const { nextLine, moved, gained } = this._processLineLeft(line);

      this.board[i] = nextLine;

      if (moved) {
        anyMoved = true;
      }

      gainedTotal += gained;
    }

    if (anyMoved) {
      this.score += gainedTotal;
      this.moves += 1;
      this.insert();
    }

    if (this._has2048()) {
      this.status = 'win';
    } else if (!this._hasMoves()) {
      this.status = 'lose';
    }

    return anyMoved;
  }
  moveRight() {
    let anyMoved = false;
    let gainedTotal = 0;

    for (let i = 0; i < this.size; i++) {
      const line = this.board[i];
      const reverse = [...line].reverse();
      const { nextLine, gained } = this._processLineLeft(reverse);
      const restored = [...nextLine].reverse();

      this.board[i] = restored;

      const moved = restored.some((v, idx) => v !== line[idx]);

      if (moved) {
        anyMoved = true;
      }

      gainedTotal += gained;
    }

    if (anyMoved) {
      this.score += gainedTotal;
      this.moves += 1;
      this.insert();
    }

    if (this._has2048()) {
      this.status = 'win';
    } else if (!this._hasMoves()) {
      this.status = 'lose';
    }

    return anyMoved;
  }
  moveUp() {
    let anyMoved = false;
    let gainedTotal = 0;

    for (let c = 0; c < this.size; c++) {
      const col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
      }

      const { nextLine, moved, gained } = this._processLineLeft(col);

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = nextLine[r];
      }

      if (moved) {
        anyMoved = true;
      }
      gainedTotal += gained;
    }

    if (anyMoved) {
      this.score += gainedTotal;
      this.moves += 1;
      this.insert();
    }

    if (this._has2048()) {
      this.status = 'win';
    } else if (!this._hasMoves()) {
      this.status = 'lose';
    }

    return anyMoved;
  }
  moveDown() {
    let anyMoved = false;
    let gainedTotal = 0;

    for (let c = 0; c < this.size; c++) {
      const col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
      }

      const reversed = [...col].reverse();
      const { nextLine, gained } = this._processLineLeft(reversed);
      const restored = [...nextLine].reverse();

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = restored[r];
      }

      const moved = restored.some((v, idx) => v !== col[idx]);

      if (moved) {
        anyMoved = true;
      }
      gainedTotal += gained;
    }

    if (anyMoved) {
      this.score += gainedTotal;
      this.moves += 1;
      this.insert();
    }

    if (this._has2048()) {
      this.status = 'win';
    } else if (!this._hasMoves()) {
      this.status = 'lose';
    }

    return anyMoved;
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
    return this.board.map((row) => row.slice());
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
    this.status = 'playing';
    this.score = 0;
    this.moves = 0;

    for (let r = 0; r < this.size; r++) {
      this.board[r].fill(0);
    }

    this.insert();
    this.insert();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'playing';
    this.score = 0;
    this.moves = 0;

    for (let r = 0; r < this.size; r++) {
      this.board[r].fill(0);
    }

    this.insert();
    this.insert();
  }

  // Add your own methods here
}

export default Game; // для браузера (ESM)
