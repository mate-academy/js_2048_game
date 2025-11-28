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
    this.status = 'playing';

    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  move(rows) {
    let moved = false;

    for (const row of rows) {
      const original = row.slice();

      const merged = this.mergeLine(row);

      if (!this.arraysEqual(original, merged)) {
        moved = true;
      }
      row.splice(0, row.length, ...merged);
    }

    return moved;
  }

  transposed(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  moveLeft() {
    const moved = this.move(this.board);

    if (moved) {
      this.addNewNumber();
      this.updateStatus();
    }
  }

  moveRight() {
    const reversed = this.board.map((row) => row.slice().reverse());
    const moved = this.move(reversed);

    if (moved) {
      this.board = reversed.map((row) => row.slice().reverse());
      this.addNewNumber();
      this.updateStatus();
    }
  }

  moveUp() {
    const transposed = this.transposed(this.board);
    const moved = this.move(transposed);

    if (moved) {
      this.board = this.transposed(transposed);
      this.addNewNumber();
      this.updateStatus();
    }
  }

  moveDown() {
    const transposedReversed = this.transposed(this.board).map((row) => {
      return row.slice().reverse();
    });
    const moved = this.move(transposedReversed);

    if (moved) {
      this.board = this.transposed(
        transposedReversed.map((row) => row.slice().reverse()),
      );
      this.addNewNumber();
      this.updateStatus();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.cloneBoard(this.board);
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addNewNumber();
    this.addNewNumber();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  mergeLine(row) {
    const nonZero = row.filter((n) => n !== 0);
    const merged = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        merged.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i++;
      } else {
        merged.push(nonZero[i]);
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  addNewNumber() {
    const emptyPosition = [];

    for (let row1 = 0; row1 < this.size; row1++) {
      for (let coll = 0; coll < this.size; coll++) {
        if (this.board[row1][coll] === 0) {
          emptyPosition.push([row1, coll]);
        }
      }
    }

    if (emptyPosition.length === 0) {
      return;
    }

    const [row, col] =
      emptyPosition[Math.floor(Math.random() * emptyPosition.length)];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    for (let row = 0; row < this.size; row++) {
      for (let cell = 0; cell < this.size; cell++) {
        const value = this.board[row][cell];

        if (
          (row < this.size - 1 && this.board[row + 1][cell] === value) ||
          (cell < this.size - 1 && this.board[row][cell + 1] === value)
        ) {
          return;
        }
      }
    }
    this.status = 'lose';
  }
}

export default Game;
