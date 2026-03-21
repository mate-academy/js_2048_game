/* eslint-disable indent */
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
    this._initial = initialState
      ? initialState.map((r) => [...r])
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];

    this._state = this._initial.map((r) => [...r]);
    this._score = 0;
    this._status = 'idle';
  }

  moveLeft() {
    return this._move('left');
  }

  moveRight() {
    return this._move('right');
  }

  moveUp() {
    return this._move('up');
  }

  moveDown() {
    return this._move('down');
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this._score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this._state.map((r) => [...r]);
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
    return this._status;
  }

  /**
   * Starts the game.
   */
  start() {
    this._status = 'playing';
    this._spawnTile();
    this._spawnTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this._state = this._initial.map((r) => [...r]);
    this._score = 0;
    this._status = 'playing';
    this._spawnTile();
    this._spawnTile();
  }

  // --- Private helpers ---

  _emptyCells() {
    const cells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this._state[r][c] === 0) {
          cells.push([r, c]);
        }
      }
    }

    return cells;
  }

  _spawnTile() {
    const cells = this._emptyCells();

    if (!cells.length) {
      return;
    }

    const [r, c] = cells[Math.floor(Math.random() * cells.length)];

    this._state[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  /**
   * Slides and merges a single row to the left.
   * Returns the new row and the score gained from merges.
   */
  _slideRow(row) {
    let nums = row.filter((x) => x !== 0);
    let score = 0;

    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] === nums[i + 1]) {
        nums[i] *= 2;
        score += nums[i];
        nums[i + 1] = 0;
        i++; // skip merged cell — can't merge twice
      }
    }

    nums = nums.filter((x) => x !== 0);

    while (nums.length < 4) {
      nums.push(0);
    }

    return { row: nums, score };
  }

  _move(dir) {
    if (this._status !== 'playing') {
      return false;
    }

    let changed = false;
    let gained = 0;
    const s = this._state;

    if (dir === 'left') {
      for (let r = 0; r < 4; r++) {
        const { row, score } = this._slideRow(s[r]);

        if (row.join() !== s[r].join()) {
          changed = true;
        }
        s[r] = row;
        gained += score;
      }
    } else if (dir === 'right') {
      for (let r = 0; r < 4; r++) {
        const { row, score } = this._slideRow([...s[r]].reverse());
        const nr = row.reverse();

        if (nr.join() !== s[r].join()) {
          changed = true;
        }
        s[r] = nr;
        gained += score;
      }
    } else if (dir === 'up') {
      for (let c = 0; c < 4; c++) {
        const col = s.map((r) => r[c]);
        const { row, score } = this._slideRow(col);

        if (row.join() !== col.join()) {
          changed = true;
        }
        row.forEach((v, r) => (s[r][c] = v));
        gained += score;
      }
    } else if (dir === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = s.map((r) => r[c]).reverse();
        const { row, score } = this._slideRow(col);
        const nr = row.reverse();

        if (nr.join() !== s.map((r) => r[c]).join()) {
          changed = true;
        }
        nr.forEach((v, r) => (s[r][c] = v));
        gained += score;
      }
    }

    if (!changed) {
      return false;
    }

    this._score += gained;
    this._spawnTile();

    if (s.some((r) => r.some((v) => v === 2048))) {
      this._status = 'win';

      return true;
    }

    if (!this._emptyCells().length && !this._hasValidMoves()) {
      this._status = 'lose';
    }

    return true;
  }

  _hasValidMoves() {
    const s = this._state;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && s[r][c] === s[r][c + 1]) {
          return true;
        }

        if (r < 3 && s[r][c] === s[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
