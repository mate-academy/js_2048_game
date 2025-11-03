'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.SIZE = 4;

    const empty = () =>
      Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(0));

    this._initial =
      initialState && initialState.length === this.SIZE
        ? initialState.map((r) => r.slice())
        : empty();

    this.board = this._initial.map((r) => r.slice());
    this.score = 0;
    this.status = 'idle';
    this._won = false;
  }
  /** .
   *
   *
   *
   *
   *
   *                                                                  `
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]\
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */

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
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((r) => r.slice());
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
    if (this.status === 'playing') {
      return;
    }

    this.board = this._initial.map((r) => r.slice());
    this.score = 0;
    this.status = 'playing';
    this._won = false;

    if (this._isEmptyBoard(this.board)) {
      this._addRandomTile();
      this._addRandomTile();
    }

    this._updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this._initial.map((r) => r.slice());
    this.score = 0;
    this.status = 'idle';
    this._won = false;
  }

  _isEmptyBoard(b) {
    return b.flat().every((v) => v === 0);
  }

  _move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const prevState = this.getState();

    switch (direction) {
      case 'left':
        this._moveLeftImpl();
        break;
      case 'right':
        this._moveRightImpl();
        break;
      case 'up':
        this._moveUpImpl();
        break;
      case 'down':
        this._moveDownImpl();
        break;
      default:
        return false;
    }

    const changed = !this._boardsEqual(prevState, this.board);

    if (changed) {
      this._addRandomTile();
      this._updateStatus();
    }
    this._updateStatus();

    if (!this._hasMoves() && this.status === 'playing') {
      this.status = 'lose';
    }

    return changed;
  }

  _boardsEqual(a, b) {
    return a.flat().every((v, i) => v === b.flat()[i]);
  }

  _addRandomTile() {
    const empties = [];

    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        if (this.board[r][c] === 0) {
          empties.push([r, c]);
        }
      }
    }

    if (empties.length === 0) {
      return;
    }

    const [rr, cc] = empties[Math.floor(Math.random() * empties.length)];

    this.board[rr][cc] = Math.random() < 0.1 ? 4 : 2;
  }

  _updateStatus() {
    if (!this._won && this._hasTarget(2048)) {
      this.status = 'win';
      this._won = true;

      return;
    }

    if (this._hasMoves()) {
      if (this.status !== 'win') {
        this.status = 'playing';
      }

      return;
    }

    if (this.status !== 'idle') {
      this.status = 'lose';
    }
  }

  _hasTarget(val) {
    return this.board.flat().includes(val);
  }

  _hasMoves() {
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        const v = this.board[r][c];

        if (v === 0) {
          return true;
        }

        if (r + 1 < this.SIZE && this.board[r + 1][c] === v) {
          return true;
        }

        if (c + 1 < this.SIZE && this.board[r][c + 1] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _moveLeftImpl() {
    let gained = 0;

    for (let r = 0; r < this.SIZE; r++) {
      const row = this.board[r].filter((v) => v !== 0);
      const merged = [];

      for (let i = 0; i < row.length; i++) {
        const curr = row[i];
        const next = row[i + 1];

        if (next && curr === next) {
          const nv = curr * 2;

          merged.push(nv);
          gained += nv;
          i++;
        } else {
          merged.push(curr);
        }
      }

      while (merged.length < this.SIZE) {
        merged.push(0);
      }

      this.board[r] = merged;
    }

    this.score += gained;
  }

  _moveRightImpl() {
    this.board = this.board.map((row) => row.slice().reverse());
    this._moveLeftImpl();
    this.board = this.board.map((row) => row.slice().reverse());
  }

  _moveUpImpl() {
    this.board = this._transpose(this.board);
    this._moveLeftImpl();
    this.board = this._transpose(this.board);
  }

  _moveDownImpl() {
    this.board = this._transpose(this.board);
    this._moveRightImpl();
    this.board = this._transpose(this.board);
  }

  _transpose(b) {
    return b[0].map((_, c) => b.map((r) => r[c]));
  }
}

export default Game;
