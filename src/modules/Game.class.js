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
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  createBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    const moved = this.move(
      (row) => row,
      (row) => row.reverse(),
      (row) => row.reverse(),
    );

    if (moved) {
      this.afterMove();
    }
  }

  moveRight() {
    const moved = this.move(
      (row) => row.reverse(),
      (row) => row.reverse(),
      (row) => row,
    );

    if (moved) {
      this.afterMove();
    }
  }

  moveUp() {
    const moved = this.moveColumns(
      (c) => c,
      (c) => c.reverse(),
      (c) => c.reverse(),
    );

    if (moved) {
      this.afterMove();
    }
  }

  moveDown() {
    const moved = this.moveColumns(
      (c) => c.reverse(),
      (c) => c.reverse(),
      (c) => c,
    );

    if (moved) {
      this.afterMove();
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
    this.score = 0;
    this.status = 'playing';
    this.board = this.createBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  addRandomTile() {
    const empty = [];

    for (let a = 0; a < this.size; a++) {
      for (let b = 0; b < this.size; b++) {
        if (this.board[a][b] === 0) {
          empty.push([a, b]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  move(transformIn, transformOut, restore) {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let row = [...this.board[r]];

      row = transformIn(row);

      const merged = [];
      const compact = row.filter((v) => v !== 0);

      for (let i = 0; i < compact.length - 1; i++) {
        if (compact[i] === compact[i + 1]) {
          compact[i] *= 2;
          this.score += compact[i];
          compact[i + 1] = 0;
          merged.push(i);
        }
      }

      const finalRow = compact.filter((v) => v !== 0);

      while (finalRow.length < this.size) {
        finalRow.push(0);
      }

      const restored = restore(transformOut(finalRow));

      if (restored.toString() !== this.board[r].toString()) {
        moved = true;
      }
      this.board[r] = restored;
    }

    return moved;
  }

  moveColumns(transformIn, transformOut, restore) {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
        col = transformIn(col);
      }

      const compact = col.filter((v) => v !== 0);

      for (let i = 0; i < compact.length - 1; i++) {
        if (compact[i] === compact[i + 1]) {
          compact[i] *= 2;
          this.score += compact[i];
          compact[i + 1] = 0;
        }
      }

      const finalCol = compact.filter((v) => v !== 0);

      while (finalCol.length < this.size) {
        finalCol.push(0);
      }

      const restored = restore(transformOut(finalCol));

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== restored[r]) {
          moved = true;
        }
        this.board[r][c] = restored[r];
      }
    }

    return moved;
  }

  afterMove() {
    this.addRandomTile();
    this.checkStatus();
  }

  checkStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      this.status = 'playing';

      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (
          (r < this.size - 1 && val === this.board[r + 1][c]) ||
          (c < this.size - 1 && val === this.board[r][c + 1])
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
