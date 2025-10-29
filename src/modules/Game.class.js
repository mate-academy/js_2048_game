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

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : this.#createEmptyBoard();
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const { newBoard, moveScore, changed } = this.#moveRowsLeft(this.state);

    this.#finalizeMove({ newBoard, moveScore, changed });
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    // Reverse each row, move left, then reverse back
    const reversed = this.state.map((row) => [...row].reverse());
    const { newBoard, moveScore, changed } = this.#moveRowsLeft(reversed);
    const restored = newBoard.map((row) => row.reverse());

    this.#finalizeMove({ newBoard: restored, moveScore, changed });
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.#transpose(this.state);
    const { newBoard, moveScore, changed } = this.#moveRowsLeft(transposed);
    const restored = this.#transpose(newBoard);

    this.#finalizeMove({ newBoard: restored, moveScore, changed });
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.#transpose(this.state).map((row) => row.reverse());
    const { newBoard, moveScore, changed } = this.#moveRowsLeft(transposed);
    const restored = this.#transpose(newBoard.map((row) => row.reverse()));

    this.#finalizeMove({ newBoard: restored, moveScore, changed });
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
    return this.state.map((row) => [...row]);
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
      // start from current state (could be custom)
      this.status = 'playing';
      // Add two numbers
      this.#addRandomTile();
      this.#addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  #createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  #transpose(board) {
    const result = this.#createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        result[c][r] = board[r][c];
      }
    }

    return result;
  }

  #compactLineLeft(line) {
    return line
      .filter(Boolean)
      .concat(Array(this.size - line.filter(Boolean).length).fill(0));
  }

  #mergeLineLeft(line) {
    const result = [...line];
    let gained = 0;

    for (let i = 0; i < this.size - 1; i++) {
      if (result[i] !== 0 && result[i] === result[i + 1]) {
        result[i] *= 2;
        gained += result[i];
        result[i + 1] = 0; // merged tile cannot merge again this move
        i++; // skip next since it is zero now
      }
    }

    return { merged: result, gained };
  }

  #moveRowsLeft(board) {
    let changed = false;
    let moveScore = 0;
    const newBoard = board.map((row) => {
      const compact1 = this.#compactLineLeft(row);
      const { merged, gained } = this.#mergeLineLeft(compact1);
      const compact2 = this.#compactLineLeft(merged);

      if (!changed && !this.#rowsEqual(row, compact2)) {
        changed = true;
      }
      moveScore += gained;

      return compact2;
    });

    return { newBoard, moveScore, changed };
  }

  #rowsEqual(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  #finalizeMove({ newBoard, moveScore, changed }) {
    if (!changed) {
      // if board didn't change, but no moves are possible -> lose
      if (!this.#canMove()) {
        this.status = 'lose';
      }

      return;
    }

    this.state = newBoard;
    this.score += moveScore;

    // Win check
    if (this.#has2048()) {
      this.status = 'win';

      return;
    }

    // Add a new tile
    this.#addRandomTile();

    // After adding a tile, check for lose
    if (!this.#canMove()) {
      this.status = 'lose';
    }
  }

  #emptyCells() {
    const empties = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === 0) {
          empties.push([r, c]);
        }
      }
    }

    return empties;
  }

  #addRandomTile() {
    const empties = this.#emptyCells();

    if (empties.length === 0) {
      return false;
    }

    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    // 10% chance to be 4

    this.state[r][c] = Math.random() < 0.1 ? 4 : 2;

    return true;
  }

  #has2048() {
    for (const row of this.state) {
      for (const v of row) {
        if (v === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  #canMove() {
    // If there is any empty cell
    for (const row of this.state) {
      for (const v of row) {
        if (v === 0) {
          return true;
        }
      }
    }

    // Check adjacent equals horizontally
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }
      }
    }

    // Check adjacent equals vertically
    for (let c = 0; c < this.size; c++) {
      for (let r = 0; r < this.size - 1; r++) {
        if (this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
