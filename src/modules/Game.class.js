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
  constructor(initialState = null) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.size = 4;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft(addTile = true) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const newRow = this.combineRowLeft(this.board[r]);

      if (newRow.join() !== this.board[r].join()) {
        moved = true;
      }

      this.board[r] = newRow;
    }

    if (moved && addTile) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight(addTile = true) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const reversed = [...this.board[r]].reverse();
      const newRow = this.combineRowLeft(reversed).reverse();

      if (newRow.join() !== this.board[r].join()) {
        moved = true;
      }

      this.board[r] = newRow;
    }

    if (moved && addTile) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveUp(addTile = true) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.transpose();
    this.moveLeft(false);
    this.transpose();

    if (oldBoard !== JSON.stringify(this.board) && addTile) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveDown(addTile = true) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.transpose();
    this.moveRight(false);
    this.transpose();

    if (oldBoard !== JSON.stringify(this.board) && addTile) {
      this.addRandomTile();
    }

    this.updateStatus();
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
  start(addTiles = true) {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.score = 0;

    this.board = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });

    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  /**
   * Resets the game.
   */
  restart(addTiles = true) {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();

    this.updateStatus();
  }

  addRandomTile() {
    const empty = [];

    for (let r1 = 0; r1 < 4; r1++) {
      for (let c1 = 0; c1 < 4; c1++) {
        if (this.board[r1][c1] === 0) {
          empty.push({ r: r1, c: c1 });
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * empty.length);

    const { r, c } = empty[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[r][c] = value;
  }

  combineRowLeft(row) {
    let newRow = row.filter((num) => num !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
        i++;
      }
    }

    newRow = newRow.filter((num) => num !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  transpose() {
    const newBoard = [];

    for (let i = 0; i < 4; i++) {
      newBoard[i] = [];

      for (let j = 0; j < 4; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }

    this.board = newBoard;
  }

  updateStatus() {
    let has2048 = false;
    let hasEmpty = false;
    let canMove = false;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          has2048 = true;
        }

        if (this.board[r][c] === 0) {
          hasEmpty = true;
        }
      }

      for (let c = 0; c < this.size - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          canMove = true;
        }
      }
    }

    for (let c = 0; c < this.size; c++) {
      for (let r = 0; r < this.size - 1; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          canMove = true;
        }
      }
    }

    if (has2048) {
      this.status = 'win';
    } else if (!hasEmpty && !canMove) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }
}

module.exports = Game;
