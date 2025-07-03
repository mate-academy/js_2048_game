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
      ? this.#copyBoard(initialState)
      : this.#createEmptyBoard();

    if (!initialState) {
      this.#addRandomTile();
      this.#addRandomTile();
    }
  }

  moveLeft() {
    this.#move('left');
  }
  moveRight() {
    this.#move('right');
  }
  moveUp() {
    this.#move('up');
  }
  moveDown() {
    this.#move('down');
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
    return this.#copyBoard(this.board);
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
    if (this.status === 'idle') {
      this.status = 'playing';
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.#createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.#addRandomTile();
    this.#addRandomTile();
  }

  // Add your own methods here
  #createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  #copyBoard(board) {
    return board.map((row) => row.slice());
  }

  #addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [rowIdx, colIdx] = empty[Math.floor(Math.random() * empty.length)];

    this.board[rowIdx][colIdx] = Math.random() < 0.9 ? 2 : 4;
  }

  #move(direction) {
    if (this.status !== 'playing' && this.status !== 'idle') {
      return;
    }

    if (this.status === 'idle') {
      this.start();
    }

    const rotated = this.#prepareBoard(direction);
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const original = rotated[row].slice();
      const compressed = this.#compressRow(rotated[row]);

      rotated[row] = compressed;

      if (!moved && compressed.join(',') !== original.join(',')) {
        moved = true;
      }
    }

    const restored = this.#restoreBoard(rotated, direction);

    if (moved) {
      this.board = restored;
      this.#addRandomTile();

      if (this.#checkWin()) {
        this.status = 'win';
      } else if (!this.#canMove()) {
        this.status = 'lose';
      }
    }
  }

  #prepareBoard(direction) {
    const b = this.#copyBoard(this.board);

    if (direction === 'up') {
      return this.#rotateLeft(b);
    }

    if (direction === 'down') {
      return this.#rotateRight(b);
    }

    if (direction === 'right') {
      return b.map((row) => row.slice().reverse());
    }

    return b;
  }

  #restoreBoard(board, direction) {
    if (direction === 'up') {
      return this.#rotateRight(board);
    }

    if (direction === 'down') {
      return this.#rotateLeft(board);
    }

    if (direction === 'right') {
      return board.map((row) => row.slice().reverse());
    }

    return board;
  }

  #rotateLeft(board) {
    const res = this.#createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        res[this.size - c - 1][r] = board[r][c];
      }
    }

    return res;
  }

  #rotateRight(board) {
    const res = this.#createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        res[c][this.size - r - 1] = board[r][c];
      }
    }

    return res;
  }

  #compressRow(row) {
    const filtered = row.filter((v) => v !== 0);
    const newRow = [];
    let i = 0;

    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        newRow.push(merged);
        this.score += merged;
        i += 2;
      } else {
        newRow.push(filtered[i]);
        i += 1;
      }
    }

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  #checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  #canMove() {
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
}

export default Game;
