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
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : defaultState;

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.board.map((row) => [...row]);
    let gained = 0;

    this.board = this.board.map((row) => {
      const [newRow, rowScore] = this._slideLeft(row);

      gained += rowScore;

      return newRow;
    });

    if (this._boardChanged(prev, this.board)) {
      this.score += gained;
      this._addRandomCell();
      this._updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.board.map((row) => [...row]);
    let gained = 0;

    this.board = this.board.map((row) => {
      const [slid, rowScore] = this._slideLeft([...row].reverse());

      gained += rowScore;

      return slid.reverse();
    });

    if (this._boardChanged(prev, this.board)) {
      this.score += gained;
      this._addRandomCell();
      this._updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.board.map((row) => [...row]);
    let gained = 0;

    const transposed = this._transpose(this.board);
    const newTransposed = transposed.map((row) => {
      const [newRow, rowScore] = this._slideLeft(row);

      gained += rowScore;

      return newRow;
    });

    this.board = this._transpose(newTransposed);

    if (this._boardChanged(prev, this.board)) {
      this.score += gained;
      this._addRandomCell();
      this._updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.board.map((row) => [...row]);
    let gained = 0;

    const transposed = this._transpose(this.board);
    const newTransposed = transposed.map((row) => {
      const [slid, rowScore] = this._slideLeft([...row].reverse());

      gained += rowScore;

      return slid.reverse();
    });

    this.board = this._transpose(newTransposed);

    if (this._boardChanged(prev, this.board)) {
      this.score += gained;
      this._addRandomCell();
      this._updateStatus();
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
    return this.board.map((row) => [...row]);
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
    this._addRandomCell();
    this._addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  _slideLeft(row) {
    const tiles = row.filter((v) => v !== 0);
    const result = [];
    let scoreGained = 0;
    let i = 0;

    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
        const merged = tiles[i] * 2;

        result.push(merged);
        scoreGained += merged;
        i += 2;
      } else {
        result.push(tiles[i]);
        i++;
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return [result, scoreGained];
  }

  _transpose(board) {
    return board[0].map((_, col) => board.map((row) => row[col]));
  }

  _boardChanged(prev, next) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (prev[r][c] !== next[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _getEmptyCells() {
    const cells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          cells.push([r, c]);
        }
      }
    }

    return cells;
  }

  _addRandomCell() {
    const empty = this._getEmptyCells();

    if (empty.length === 0) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  _updateStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this._hasMovesAvailable()) {
      this.status = 'lose';
    }
  }

  _hasMovesAvailable() {
    for (const row of this.board) {
      if (row.includes(0)) {
        return true;
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
