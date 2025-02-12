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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((val) => val !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow.splice(col + 1, 1);
          newRow.push(0);
          moved = true;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (this.board[row].join() !== newRow.join()) {
        moved = true;
      }
      this.board[row] = newRow;
    }

    if (moved) {
      this.spawnTile();
    }
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);
  }

  moveDown() {
    this.board = this.transpose(this.board).map((row) => row.reverse());
    this.moveLeft();
    this.board = this.transpose(this.board.map((row) => row.reverse()));
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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    for (let i = 0; i < 2; i++) {
      this.spawnTile();
    }
  }

  spawnTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ r: row, c: col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  /**
   * Resets the game.
   */
  restart() {
    if (this.status === 'lose') {
      this.start();
    }
  }

  // Add your own methods here

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  checkLose() {
    if (this.status !== 'playing') {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }
  }
}

module.exports = Game;
