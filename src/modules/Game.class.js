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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.board = initialState || this.createBoard();
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  createBoard() {
    const board = [];

    for (let i = 0; i < this.size; i++) {
      const row = [];

      for (let t = 0; t < this.size; t++) {
        row.push(0);
      }
      board.push(row);
    }

    return board;
  }

  move(transformRows, reverse = false) {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const row = transformRows(this.board[r].slice());
      const { newRow, scoreGained, changed } = this.mergeRow(row);

      if (reverse) {
        newRow.reverse();
      }
      this.board[r] = newRow;

      if (changed) {
        moved = true;
      }
      this.score += scoreGained;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameStatus();
  }

  moveCols(transformCols, reverse = false) {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
      }
      col = transformCols(col);

      const { newRow, scoreGained, changed } = this.mergeRow(col);

      if (reverse) {
        newRow.reverse();
      }

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newRow[r];
      }

      if (changed) {
        moved = true;
      }
      this.score += scoreGained;

      if (moved) {
        this.addRandomTile();
      }
      this.checkGameStatus();
    }
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    return this.move((row) => row);
  }
  moveRight() {
    return this.move((row) => row.slice().reverse(), true);
  }
  moveUp() {
    return this.moveCols((col) => col);
  }
  moveDown() {
    return this.moveCols((col) => col.slice().reverse(), true);
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

  mergeRow(row) {
    const filtered = row.filter((v) => v !== 0);
    const result = [];
    let scoreGained = 0;
    let changed = false;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        scoreGained += merged;

        if (merged === 2048) {
          this.status = 'won';
        }
        i++;
        changed = true;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    if (result.toString() !== row.toString()) {
      changed = true;
    }

    return { newRow: result, scoreGained, changed };
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

  checkGameStatus() {
    if (this.status === 'won') {
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          this.status = 'playing';

          return;
        }

        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          this.status = 'playing';

          return;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          this.status = 'playing';

          return;
        }
      }
    }
    this.status = 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = this.createBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
