'use strict';

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
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState
      ? initialState.map((row) => row.slice())
      : this.createEmptyBoard();

    this.board = this.initialState.map((row) => row.slice());
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => row.slice());
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
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

  start() {
    this.board = this.board.map((row) => row.slice());
    this.score = 0;
    this.status = 'playing';
    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  restart() {
    this.board = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft(spawn = true) {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const row = this.board[r].filter((v) => v !== 0);
      const newRow = [];

      let i = 0;

      while (i < row.length) {
        if (i + 1 < row.length && row[i] === row[i + 1]) {
          const merged = row[i] * 2;

          this.score += merged;
          newRow.push(merged);
          i += 2;
        } else {
          newRow.push(row[i]);
          i += 1;
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (!this.arraysEqual(this.board[r], newRow)) {
        moved = true;
        this.board[r] = newRow;
      }
    }

    if (moved && spawn && this.status === 'playing') {
      this.spawnRandomTile();
      this.changeGameStatus();
    }

    return moved;
  }

  moveRight(spawn = true) {
    if (this.status !== 'playing') {
      return false;
    }

    this.board = this.board.map((row) => row.slice().reverse());

    const moved = this.moveLeft(false);

    this.board = this.board.map((row) => row.slice().reverse());

    if (moved && spawn && this.status === 'playing') {
      this.spawnRandomTile();
      this.changeGameStatus();
    }

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    this.board = this.transpose(this.board);

    const moved = this.moveLeft(false);

    this.board = this.transpose(this.board);

    if (moved && this.status === 'playing') {
      this.spawnRandomTile();
      this.changeGameStatus();
    }

    return moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    this.board = this.transpose(this.board);

    const moved = this.moveRight(false);

    this.board = this.transpose(this.board);

    if (moved && this.status === 'playing') {
      this.spawnRandomTile();
      this.changeGameStatus();
    }

    return moved;
  }

  spawnRandomTile() {
    const empty = this.getEmptyCells();

    if (!empty.length) {
      return false;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2;

    return true;
  }

  getEmptyCells() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    return empty;
  }

  changeGameStatus() {
    if (this.board.flat().includes(2048) && this.status === 'playing') {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (val === 0) {
          return true;
        }

        if (r < this.size - 1 && val === this.board[r + 1][c]) {
          return true;
        }

        if (c < this.size - 1 && val === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(board) {
    return board[0].map((_, c) => board.map((row) => row[c]));
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
}

module.exports = Game;
